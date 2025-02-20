package com.ecommerce.backend.controllers;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.models.Ordine;
import com.ecommerce.backend.services.OrdineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordini")
public class OrdineController {

    private final OrdineService ordineService;

    public OrdineController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    @GetMapping
    public ResponseEntity<List<Ordine>> getAllOrders() {
        List<Ordine> ordini = ordineService.getAllOrders();
        return ResponseEntity.ok(ordini);
    }

    @GetMapping("/utente/{utenteId}")
    public ResponseEntity<List<Ordine>> getOrdersByUserId(@PathVariable Long utenteId) {
        logUtenteAutenticato();
        System.out.println("📦 Recuperando ordini per utente ID: " + utenteId);

        List<Ordine> ordini = ordineService.getOrdersByUserId(utenteId);

        if (ordini.isEmpty()) {
            throw new ResourceNotFoundException("Nessun ordine trovato per l'utente con ID " + utenteId);
        }

        return ResponseEntity.ok(ordini);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ordine> getOrderById(@PathVariable Long id) {
        Ordine ordine = ordineService.getOrderById(id);
        return ResponseEntity.ok(ordine);
    }

    @PostMapping("/checkout/{utenteId}")
    public ResponseEntity<?> createOrderFromCart(@PathVariable Long utenteId) {
        try {
            Ordine newOrder = ordineService.createOrderFromCart(utenteId);
            return ResponseEntity.ok(newOrder);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            ordineService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Ordine eliminato con successo."));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/stato")
    public ResponseEntity<?> aggiornaStatoOrdine(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String nuovoStato = request.get("stato");

        if (nuovoStato == null || nuovoStato.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lo stato dell'ordine non può essere vuoto."));
        }

        try {
            Ordine ordineAggiornato = ordineService.aggiornaStatoOrdine(id, nuovoStato);
            return ResponseEntity.ok(ordineAggiornato);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    private void logUtenteAutenticato() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            System.out.println("🔍 Utente autenticato: " + userDetails.getUsername());
            System.out.println("👤 Ruoli: " + userDetails.getAuthorities());
        }
    }
}
