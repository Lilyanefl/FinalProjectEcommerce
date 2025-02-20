package com.ecommerce.backend.services;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.models.Utente;
import com.ecommerce.backend.repository.UtenteRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UtenteService(UtenteRepository utenteRepository, BCryptPasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utente> getAllUsers() {
        return utenteRepository.findAll();
    }

    public Utente getUserById(Long id) {
        return utenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utente con ID " + id + " non trovato."));
    }

    public Utente createUser(Utente utente) {
        if (utenteRepository.findByEmail(utente.getEmail()).isPresent()) {
            throw new IllegalArgumentException("⚠️ L'email " + utente.getEmail() + " è già registrata.");
        }
        utente.setPassword(passwordEncoder.encode(utente.getPassword()));
        return utenteRepository.save(utente);
    }
    public Utente createAdminUser(Utente utente) {
        utente.setPassword(passwordEncoder.encode(utente.getPassword()));
        Set<String> ruoli = new HashSet<>();
        ruoli.add("ADMIN");
        utente.setRuoli(ruoli);
        return utenteRepository.save(utente);
    }


    public Utente updateUser(Long id, Utente newUser) {
        return utenteRepository.findById(id).map(user -> {
            user.setNome(newUser.getNome());
            user.setEmail(newUser.getEmail());

            if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(newUser.getPassword()));
            }

            return utenteRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("Utente con ID " + id + " non trovato."));
    }

    public void deleteUser(Long id) {
        if (!utenteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utente con ID " + id + " non trovato.");
        }
        utenteRepository.deleteById(id);
    }
}
