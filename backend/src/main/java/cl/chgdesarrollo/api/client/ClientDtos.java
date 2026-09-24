package cl.chgdesarrollo.api.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class ClientDtos {

    private ClientDtos() {}

    public record ClientRequest(
        @NotBlank(message = "El nombre es obligatorio") @Size(max = 150) String name,
        @Size(max = 500) String logoUrl,
        @Size(max = 500) String website,
        @Size(max = 1000) String description,
        Boolean active,
        Integer sortOrder
    ) {}

    public record ClientResponse(
        Long id,
        String name,
        String logoUrl,
        String website,
        String description,
        boolean active,
        int sortOrder
    ) {
        static ClientResponse from(Client c) {
            return new ClientResponse(c.getId(), c.getName(), c.getLogoUrl(), c.getWebsite(),
                c.getDescription(), c.isActive(), c.getSortOrder());
        }
    }
}
