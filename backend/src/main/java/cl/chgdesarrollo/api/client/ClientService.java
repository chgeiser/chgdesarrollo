package cl.chgdesarrollo.api.client;

import cl.chgdesarrollo.api.client.ClientDtos.ClientRequest;
import cl.chgdesarrollo.api.client.ClientDtos.ClientResponse;
import cl.chgdesarrollo.api.common.NotFoundException;
import cl.chgdesarrollo.api.upload.ImageStorageService;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

    private final ClientRepository repository;
    private final ImageStorageService storage;

    public ClientService(ClientRepository repository, ImageStorageService storage) {
        this.repository = repository;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> findPublic() {
        return repository.findByActiveTrueOrderBySortOrderAscIdAsc().stream().map(ClientResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> findAll() {
        return repository.findAllByOrderBySortOrderAscIdAsc().stream().map(ClientResponse::from).toList();
    }

    @Transactional
    public ClientResponse create(ClientRequest request) {
        var client = new Client();
        apply(client, request);
        return ClientResponse.from(repository.save(client));
    }

    @Transactional
    public ClientResponse update(Long id, ClientRequest request) {
        var client = get(id);
        String previousLogo = client.getLogoUrl();
        apply(client, request);
        if (!Objects.equals(previousLogo, client.getLogoUrl())) {
            storage.deleteIfManaged(previousLogo);
        }
        return ClientResponse.from(client);
    }

    @Transactional
    public void delete(Long id) {
        var client = get(id);
        repository.delete(client);
        storage.deleteIfManaged(client.getLogoUrl());
    }

    private Client get(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Cliente", id));
    }

    private static void apply(Client client, ClientRequest r) {
        client.setName(r.name().trim());
        client.setLogoUrl(blankToNull(r.logoUrl()));
        client.setWebsite(blankToNull(r.website()));
        client.setDescription(blankToNull(r.description()));
        client.setActive(r.active() == null || r.active());
        client.setSortOrder(r.sortOrder() == null ? 0 : r.sortOrder());
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
