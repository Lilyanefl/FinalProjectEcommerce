package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Utente;
import com.ecommerce.backend.repository.UtenteRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtenteRepository utenteRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UtenteRepository utenteRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String nome = request.get("nome");
            String email = request.get("email");
            String password = request.get("password");

            if (nome == null || email == null || password == null) {
                return ResponseEntity.status(400).body(Map.of("error", "Tutti i campi sono obbligatori"));
            }

            if (utenteRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("error", "Email già registrata"));
            }

            Utente user = new Utente();
            user.setNome(nome);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRuoli(new HashSet<>(Set.of("ROLE_USER")));

            utenteRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Registrazione avvenuta con successo"));
        } catch (Exception e) {
            e.printStackTrace(); // Stampa l'errore in console
            return ResponseEntity.status(500).body(Map.of("error", "Errore interno del server"));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<Utente> utenteOpt = utenteRepository.findByEmail(email);

        if (utenteOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "Unauthorized",
                    "message", "❌ Credenziali errate. Utente non trovato."
            ));
        }

        Utente utente = utenteOpt.get();

        if (!passwordEncoder.matches(password, utente.getPassword())) {
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "Unauthorized",
                    "message", "❌ Credenziali errate. Password errata."
            ));
        }

        try {
            String token = jwtUtil.generateToken(email, utente.getId(),utente.getRuoli());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", 500,
                    "error", "Internal Server Error",
                    "message", "❌ Errore interno del server durante la generazione del token."
            ));
        }
    }



}
