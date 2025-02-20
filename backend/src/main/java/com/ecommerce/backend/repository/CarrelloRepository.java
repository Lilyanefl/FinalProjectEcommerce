package com.ecommerce.backend.repository;

import com.ecommerce.backend.models.Carrello;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarrelloRepository extends JpaRepository<Carrello, Long> {
    Optional<Carrello> findByUtenteId(Long utenteId);
}
