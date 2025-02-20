package com.ecommerce.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prodotti")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Prodotto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codice;

    private String nome;
    private String descrizione;
    private Double prezzo;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "prodotto_taglie", joinColumns = @JoinColumn(name = "prodotto_id"))
    private List<String> taglia = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "prodotto_colori", joinColumns = @JoinColumn(name = "prodotto_id"))
    private List<String> colore = new ArrayList<>();

    private int stock;

    @Enumerated(EnumType.STRING)
    private TipologiaProdotto tipologia;


    private String immagineUrl;


    public Prodotto(){}
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

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public List<String> getTaglia() {
        return taglia;
    }

    public void setTaglia(List<String> taglia) {
        this.taglia = taglia;
    }

    public List<String> getColore() {
        return colore;
    }

    public void setColore(List<String> colore) {
        this.colore = colore;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCodice() {
        return codice;
    }

    public void setCodice(String codice) {
        this.codice = codice;
    }

    public String getImmagineUrl() {
        return immagineUrl;
    }

    public void setImmagineUrl(String immagineUrl) {
        this.immagineUrl = immagineUrl;
    }

    public TipologiaProdotto getTipologia() {
        return tipologia;
    }

    public void setTipologia(TipologiaProdotto tipologia) {
        this.tipologia = tipologia;
    }
}
