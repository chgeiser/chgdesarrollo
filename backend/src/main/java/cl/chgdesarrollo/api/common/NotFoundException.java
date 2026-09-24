package cl.chgdesarrollo.api.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NotFoundException extends ResponseStatusException {

    public NotFoundException(String what, Long id) {
        super(HttpStatus.NOT_FOUND, what + " " + id + " no existe");
    }
}
