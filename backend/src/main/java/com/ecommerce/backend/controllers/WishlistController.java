package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Wishlist;
import com.ecommerce.backend.services.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{utenteId}")
    public ResponseEntity<List<Wishlist>> getWishlistByUserId(@PathVariable Long utenteId) {
        List<Wishlist> wishlist = wishlistService.getWishlistByUserId(utenteId);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{utenteId}/aggiungi")
    public ResponseEntity<?> addToWishlist(@PathVariable Long utenteId, @RequestBody Map<String, Long> request) {
        Long prodottoId = request.get("prodottoId");

        if (prodottoId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ prodottoId è obbligatorio!"));
        }

        try {
            Wishlist savedWishlist = wishlistService.addToWishlist(utenteId, prodottoId);
            return ResponseEntity.ok(Map.of("message", "✅ Prodotto aggiunto alla wishlist!", "wishlist", savedWishlist));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{utenteId}/rimuovi/{prodottoId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long utenteId, @PathVariable Long prodottoId) {
        try {
            wishlistService.removeFromWishlist(utenteId, prodottoId);
            return ResponseEntity.ok(Map.of("message", "✅ Prodotto rimosso dalla wishlist!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
