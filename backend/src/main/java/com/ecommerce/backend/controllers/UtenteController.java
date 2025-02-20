package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Utente;
import com.ecommerce.backend.services.UtenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @GetMapping
    public ResponseEntity<List<Utente>> getAllUsers() {
        List<Utente> utenti = utenteService.getAllUsers();
        return ResponseEntity.ok(utenti);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utente> getUserById(@PathVariable Long id) {
        Utente utente = utenteService.getUserById(id);
        return ResponseEntity.ok(utente);
    }

    @PostMapping
    public ResponseEntity<Utente> createUser(@RequestBody Utente utente) {
        Utente nuovoUtente = utenteService.createUser(utente);
        return ResponseEntity.ok(nuovoUtente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utente> updateUser(@PathVariable Long id, @RequestBody Utente newUser) {
        Utente updatedUser = utenteService.updateUser(id, newUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        utenteService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/register-admin")
    public ResponseEntity<Utente> createAdmin(@RequestBody Utente utente) {
        Utente newAdmin = utenteService.createAdminUser(utente);
        return ResponseEntity.ok(newAdmin);
    }
}
