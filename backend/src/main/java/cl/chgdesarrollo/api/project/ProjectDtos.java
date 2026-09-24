package cl.chgdesarrollo.api.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Arrays;
import java.util.List;

public final class ProjectDtos {

    private ProjectDtos() {}

    public record ProjectRequest(
        @NotBlank(message = "El nombre del proyecto es obligatorio") @Size(max = 150) String title,
        @Size(max = 2000) String description,
        @Size(max = 500) String imageUrl,
        @Size(max = 500) String demoUrl,
        @Size(max = 100) String category,
        List<String> technologies,
        Boolean active,
        Integer sortOrder
    ) {}

    public record ProjectResponse(
        Long id,
        String title,
        String description,
        String imageUrl,
        String demoUrl,
        String category,
        List<String> technologies,
        boolean active,
        int sortOrder
    ) {
        static ProjectResponse from(Project p) {
            return new ProjectResponse(p.getId(), p.getTitle(), p.getDescription(), p.getImageUrl(),
                p.getDemoUrl(), p.getCategory(), splitTechnologies(p.getTechnologies()),
                p.isActive(), p.getSortOrder());
        }
    }

    static List<String> splitTechnologies(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    static String joinTechnologies(List<String> values) {
        if (values == null) return null;
        String joined = String.join(",", values.stream()
            .map(v -> v == null ? "" : v.replace(",", " ").trim())
            .filter(v -> !v.isEmpty())
            .distinct()
            .toList());
        return joined.isEmpty() ? null : joined;
    }
}
