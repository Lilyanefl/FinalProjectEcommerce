package com.ecommerce.backend.repository;


import com.ecommerce.backend.models.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {
}
