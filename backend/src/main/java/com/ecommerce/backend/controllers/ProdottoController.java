package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Prodotto;
import com.ecommerce.backend.services.ProdottoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prodotti")
public class ProdottoController {

    private final ProdottoService prodottoService;

    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    @GetMapping
    public ResponseEntity<List<Prodotto>> getAllProducts() {
        List<Prodotto> prodotti = prodottoService.getAllProducts();
        return ResponseEntity.ok(prodotti);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prodotto> getProductById(@PathVariable Long id) {
        Prodotto prodotto = prodottoService.getProductById(id);
        return ResponseEntity.ok(prodotto);
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
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Prodotto newProduct) {
        try {
            Prodotto updatedProduct = prodottoService.updateProduct(id, newProduct);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            prodottoService.deleteProduct(id);
            return ResponseEntity.ok().body("Prodotto eliminato con successo.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{prodottoId}/upload")
    public ResponseEntity<Map<String, String>> uploadImmagine(
            @PathVariable Long prodottoId,
            @RequestParam("file") MultipartFile file) {

        try {
            String imagePath = prodottoService.salvaImmagine(prodottoId, file);
            return ResponseEntity.ok(Map.of("message", "Immagine caricata con successo!", "path", imagePath));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
