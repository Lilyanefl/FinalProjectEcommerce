package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Prodotto;
import com.ecommerce.backend.services.ProdottoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/prodotti")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProdottoController {
    private final ProdottoService prodottoService;

    public AdminProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    @GetMapping
    public ResponseEntity<List<Prodotto>> getAllProducts() {
        return ResponseEntity.ok(prodottoService.getAllProducts());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Prodotto prodotto) {
        try {
            Prodotto newProduct = prodottoService.createProduct(prodotto);
            return ResponseEntity.ok(newProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prodotto> updateProduct(@PathVariable Long id, @RequestBody Prodotto newProduct) {
        Prodotto updatedProduct = prodottoService.updateProduct(id, newProduct);
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        prodottoService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
