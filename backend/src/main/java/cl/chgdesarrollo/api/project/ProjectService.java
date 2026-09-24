package cl.chgdesarrollo.api.project;

import cl.chgdesarrollo.api.common.NotFoundException;
import cl.chgdesarrollo.api.project.ProjectDtos.ProjectRequest;
import cl.chgdesarrollo.api.project.ProjectDtos.ProjectResponse;
import cl.chgdesarrollo.api.upload.ImageStorageService;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository repository;
    private final ImageStorageService storage;

    public ProjectService(ProjectRepository repository, ImageStorageService storage) {
        this.repository = repository;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findPublic() {
        return repository.findByActiveTrueOrderBySortOrderAscIdAsc().stream().map(ProjectResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findAll() {
        return repository.findAllByOrderBySortOrderAscIdAsc().stream().map(ProjectResponse::from).toList();
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        var project = new Project();
        apply(project, request);
        return ProjectResponse.from(repository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        var project = get(id);
        String previousImage = project.getImageUrl();
        apply(project, request);
        if (!Objects.equals(previousImage, project.getImageUrl())) {
            storage.deleteIfManaged(previousImage);
        }
        return ProjectResponse.from(project);
    }

    @Transactional
    public void delete(Long id) {
        var project = get(id);
        repository.delete(project);
        storage.deleteIfManaged(project.getImageUrl());
    }

    private Project get(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Proyecto", id));
    }

    private static void apply(Project project, ProjectRequest r) {
        project.setTitle(r.title().trim());
        project.setDescription(blankToNull(r.description()));
        project.setImageUrl(blankToNull(r.imageUrl()));
        project.setDemoUrl(blankToNull(r.demoUrl()));
        project.setCategory(blankToNull(r.category()));
        project.setTechnologies(ProjectDtos.joinTechnologies(r.technologies()));
        project.setActive(r.active() == null || r.active());
        project.setSortOrder(r.sortOrder() == null ? 0 : r.sortOrder());
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
