package cl.chgdesarrollo.api.project;

import cl.chgdesarrollo.api.project.ProjectDtos.ProjectRequest;
import cl.chgdesarrollo.api.project.ProjectDtos.ProjectResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping("/api/public/projects")
    public List<ProjectResponse> publicList() {
        return service.findPublic();
    }

    @GetMapping("/api/admin/projects")
    public List<ProjectResponse> list() {
        return service.findAll();
    }

    @PostMapping("/api/admin/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return service.create(request);
    }

    @PutMapping("/api/admin/projects/{id}")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/api/admin/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
