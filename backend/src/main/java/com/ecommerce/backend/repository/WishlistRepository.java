package com.ecommerce.backend.repository;

import com.ecommerce.backend.models.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUtenteId(Long utenteId);

    Optional<Wishlist> findByUtenteIdAndProdottoId(Long utenteId, Long prodottoId);
}
