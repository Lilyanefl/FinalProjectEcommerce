package com.ecommerce.backend.services;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.models.Wishlist;
import com.ecommerce.backend.models.Prodotto;
import com.ecommerce.backend.models.Utente;
import com.ecommerce.backend.repository.WishlistRepository;
import com.ecommerce.backend.repository.ProdottoRepository;
import com.ecommerce.backend.repository.UtenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProdottoRepository prodottoRepository;
    private final UtenteRepository utenteRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProdottoRepository prodottoRepository, UtenteRepository utenteRepository) {
        this.wishlistRepository = wishlistRepository;
        this.prodottoRepository = prodottoRepository;
        this.utenteRepository = utenteRepository;
    }

    public List<Wishlist> getWishlistByUserId(Long utenteId) {
        return wishlistRepository.findByUtenteId(utenteId);
    }

    public Wishlist addToWishlist(Long utenteId, Long prodottoId) {
        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new ResourceNotFoundException("Utente con ID " + utenteId + " non trovato"));

        Prodotto prodotto = prodottoRepository.findById(prodottoId)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto con ID " + prodottoId + " non trovato"));

        if (wishlistRepository.findByUtenteIdAndProdottoId(utenteId, prodottoId).isPresent()) {
            throw new IllegalStateException("❗ Il prodotto è già nella wishlist!");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUtente(utente);
        wishlist.setProdotto(prodotto);
        return wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(Long utenteId, Long prodottoId) {
        Wishlist wishlist = wishlistRepository.findByUtenteIdAndProdottoId(utenteId, prodottoId)
                .orElseThrow(() -> new ResourceNotFoundException("Il prodotto non è presente nella wishlist!"));

        wishlistRepository.delete(wishlist);
    }
}
