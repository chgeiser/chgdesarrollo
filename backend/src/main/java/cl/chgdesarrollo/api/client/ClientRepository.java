package cl.chgdesarrollo.api.client;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {

    List<Client> findAllByOrderBySortOrderAscIdAsc();

    List<Client> findByActiveTrueOrderBySortOrderAscIdAsc();
}
