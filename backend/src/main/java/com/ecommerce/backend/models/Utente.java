package com.ecommerce.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "utenti")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ruoli", joinColumns = @JoinColumn(name = "utente_id"))

    @Column(name = "ruolo")
    private Set<String> ruoli = new HashSet<>();

    public Utente (){}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRuoli() {
        return ruoli;
    }

    public void setRuoli(Set<String> ruoli) {
        this.ruoli = ruoli;
    }
}
