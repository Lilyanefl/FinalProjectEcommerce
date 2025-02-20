package com.ecommerce.backend.repository;

import com.ecommerce.backend.models.Ordine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdineRepository extends JpaRepository<Ordine, Long> {
    List<Ordine> findByUtenteId(Long utenteId);
}
