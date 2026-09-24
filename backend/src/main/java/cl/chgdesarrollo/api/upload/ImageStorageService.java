package cl.chgdesarrollo.api.upload;

import cl.chgdesarrollo.api.config.AppProperties;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Guarda imágenes en disco (un volumen Docker en producción) y las expone bajo
 * {@code app.uploads.public-path}. El tipo se detecta por los bytes del archivo,
 * no por la extensión ni el Content-Type que envía el navegador.
 */
@Service
public class ImageStorageService {

    private static final Logger log = LoggerFactory.getLogger(ImageStorageService.class);

    private final Path root;
    private final String publicPath;

    public ImageStorageService(AppProperties props) throws IOException {
        this.root = Path.of(props.uploads().dir()).toAbsolutePath().normalize();
        this.publicPath = props.uploads().publicPath();
        Files.createDirectories(root);
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se recibió ninguna imagen");
        }
        try {
            String extension = detectExtension(file);
            String filename = UUID.randomUUID() + "." + extension;
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, root.resolve(filename));
            }
            return publicPath + "/" + filename;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar la imagen", e);
        }
    }

    /** Elimina el archivo si la URL apunta a una imagen subida por este servicio. */
    public void deleteIfManaged(String url) {
        if (url == null || !url.startsWith(publicPath + "/")) {
            return;
        }
        Path target = root.resolve(url.substring(publicPath.length() + 1)).normalize();
        if (!target.startsWith(root)) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            log.warn("No se pudo eliminar {}", target, e);
        }
    }

    private static String detectExtension(MultipartFile file) throws IOException {
        byte[] head;
        try (InputStream in = file.getInputStream()) {
            head = in.readNBytes(12);
        }
        if (startsWith(head, 0x89, 'P', 'N', 'G')) return "png";
        if (startsWith(head, 0xFF, 0xD8, 0xFF)) return "jpg";
        if (startsWith(head, 'G', 'I', 'F', '8')) return "gif";
        if (startsWith(head, 'R', 'I', 'F', 'F') && head.length >= 12
            && Arrays.equals(Arrays.copyOfRange(head, 8, 12), "WEBP".getBytes())) return "webp";
        throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            "Formato no soportado. Usa PNG, JPG, WEBP o GIF");
    }

    private static boolean startsWith(byte[] data, int... prefix) {
        if (data.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if ((data[i] & 0xFF) != prefix[i]) return false;
        }
        return true;
    }
}
