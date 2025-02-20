package com.ecommerce.backend.models;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "carrelli")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Carrello {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @OneToMany(mappedBy = "carrello", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CarrelloProdotto> prodotti;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public List<CarrelloProdotto> getProdotti() {
        return prodotti;
    }

    public void setProdotti(List<CarrelloProdotto> prodotti) {
        this.prodotti = prodotti;
    }
}


