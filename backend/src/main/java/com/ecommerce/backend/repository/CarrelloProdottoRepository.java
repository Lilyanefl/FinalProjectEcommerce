package com.ecommerce.backend.repository;


import com.ecommerce.backend.models.CarrelloProdotto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CarrelloProdottoRepository extends JpaRepository<CarrelloProdotto, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM CarrelloProdotto cp WHERE cp.carrello.id = :carrelloId")
    void deleteAllByCarrelloId(@Param("carrelloId") Long carrelloId);
    Optional<CarrelloProdotto> findByCarrelloIdAndProdottoIdAndTagliaAndColore(Long carrelloId, Long prodottoId, String taglia, String colore);
}
