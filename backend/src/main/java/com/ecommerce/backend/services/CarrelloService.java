package com.ecommerce.backend.services;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.models.*;
import com.ecommerce.backend.repository.CarrelloProdottoRepository;
import com.ecommerce.backend.repository.CarrelloRepository;
import com.ecommerce.backend.repository.ProdottoRepository;
import com.ecommerce.backend.repository.UtenteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Service
public class CarrelloService {

    private final CarrelloRepository carrelloRepository;
    private final CarrelloProdottoRepository carrelloProdottoRepository;
    private final ProdottoRepository prodottoRepository;
    private final UtenteRepository utenteRepository;

    public CarrelloService(CarrelloRepository carrelloRepository,
                           CarrelloProdottoRepository carrelloProdottoRepository,
                           ProdottoRepository prodottoRepository,
                           UtenteRepository utenteRepository) {
        this.carrelloRepository = carrelloRepository;
        this.carrelloProdottoRepository = carrelloProdottoRepository;
        this.prodottoRepository = prodottoRepository;
        this.utenteRepository = utenteRepository;
    }

    public Carrello getCarrelloByUtente(Long utenteId) {
        return carrelloRepository.findByUtenteId(utenteId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrello per utente ID " + utenteId + " non trovato."));
    }


    @Transactional
    public Carrello aggiungiProdottoAlCarrello(Long utenteId, Long prodottoId, int quantita, String taglia, String colore) {
        Optional<Utente> utenteOpt = utenteRepository.findById(utenteId);
        Optional<Prodotto> prodottoOpt = prodottoRepository.findById(prodottoId);

        if (utenteOpt.isPresent() && prodottoOpt.isPresent()) {
            Utente utente = utenteOpt.get();
            Prodotto prodotto = prodottoOpt.get();


            Carrello carrello = carrelloRepository.findByUtenteId(utenteId)
                    .orElseGet(() -> {
                        Carrello nuovoCarrello = new Carrello();
                        nuovoCarrello.setUtente(utente);
                        return carrelloRepository.save(nuovoCarrello);
                    });


            Optional<CarrelloProdotto> esistente = carrelloProdottoRepository
                    .findByCarrelloIdAndProdottoIdAndTagliaAndColore(carrello.getId(), prodottoId, taglia, colore);

            if (esistente.isPresent()) {
                CarrelloProdotto carrelloProdotto = esistente.get();
                carrelloProdotto.setQuantita(carrelloProdotto.getQuantita() + quantita);
                carrelloProdottoRepository.save(carrelloProdotto);
            } else {
                CarrelloProdotto nuovoCarrelloProdotto = new CarrelloProdotto();
                nuovoCarrelloProdotto.setCarrello(carrello);
                nuovoCarrelloProdotto.setProdotto(prodotto);
                nuovoCarrelloProdotto.setQuantita(quantita);
                nuovoCarrelloProdotto.setPrezzoUnitario(prodotto.getPrezzo());
                nuovoCarrelloProdotto.setTaglia(taglia);
                nuovoCarrelloProdotto.setColore(colore);
                carrelloProdottoRepository.save(nuovoCarrelloProdotto);
            }

            return carrello;
        }
        throw new IllegalArgumentException("Utente o Prodotto non trovato");
    }


    @Transactional
    public void rimuoviProdottoDalCarrello(Long utenteId, Long prodottoId, String taglia, String colore) {
        Carrello carrello = getCarrelloByUtente(utenteId);

        CarrelloProdotto prodottoNelCarrello = carrelloProdottoRepository
                .findByCarrelloIdAndProdottoIdAndTagliaAndColore(carrello.getId(), prodottoId, taglia, colore)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto con ID " + prodottoId + " (Taglia: " + taglia + ", Colore: " + colore + ") non trovato nel carrello."));

        carrelloProdottoRepository.delete(prodottoNelCarrello);
    }


    @Transactional
    public void rimuoviQuantitaDalCarrello(Long utenteId, Long prodottoId, String taglia, String colore, int quantitaDaRimuovere) {
        Carrello carrello = getCarrelloByUtente(utenteId);

        CarrelloProdotto carrelloProdotto = carrelloProdottoRepository
                .findByCarrelloIdAndProdottoIdAndTagliaAndColore(carrello.getId(), prodottoId, taglia, colore)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto con ID " + prodottoId + " (Taglia: " + taglia + ", Colore: " + colore + ") non trovato nel carrello."));

        if (quantitaDaRimuovere <= 0) {
            throw new IllegalArgumentException("La quantità da rimuovere deve essere maggiore di 0.");
        }

        if (carrelloProdotto.getQuantita() > quantitaDaRimuovere) {
            carrelloProdotto.setQuantita(carrelloProdotto.getQuantita() - quantitaDaRimuovere);
            carrelloProdottoRepository.save(carrelloProdotto);
        } else {
            carrelloProdottoRepository.delete(carrelloProdotto);
        }
    }


    @Transactional
    public void incrementaQuantita(Long utenteId, Long prodottoId, String taglia, String colore, int quantita) {
        Carrello carrello = getCarrelloByUtente(utenteId);

        CarrelloProdotto carrelloProdotto = carrelloProdottoRepository
                .findByCarrelloIdAndProdottoIdAndTagliaAndColore(carrello.getId(), prodottoId, taglia, colore)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto con ID " + prodottoId + " (Taglia: " + taglia + ", Colore: " + colore + ") non trovato nel carrello."));

        if (quantita <= 0) {
            throw new IllegalArgumentException("La quantità deve essere maggiore di 0.");
        }

        carrelloProdotto.setQuantita(carrelloProdotto.getQuantita() + quantita);
        carrelloProdottoRepository.save(carrelloProdotto);
    }


    @Transactional
    public void svuotaCarrello(Long utenteId) {
        Carrello carrello = getCarrelloByUtente(utenteId);

        if (carrello.getProdotti().isEmpty()) {
            throw new IllegalStateException("Il carrello è già vuoto.");
        }

        carrelloProdottoRepository.deleteAllByCarrelloId(carrello.getId());
        carrello.setProdotti(Collections.emptyList());
        carrelloRepository.save(carrello);
    }

    @Transactional
    public void rimuoviProdottoDalDatabase(CarrelloProdotto prodottoCarrello) {
        if (prodottoCarrello == null) {
            throw new IllegalArgumentException("Il prodotto da rimuovere non può essere nullo.");
        }
        carrelloProdottoRepository.delete(prodottoCarrello);
    }
    public Carrello creaCarrello(Long utenteId) {
        Optional<Utente> utenteOpt = utenteRepository.findById(utenteId);

        if (utenteOpt.isEmpty()) {
            throw new ResourceNotFoundException("Utente non trovato con ID: " + utenteId);
        }

        if (carrelloRepository.findByUtenteId(utenteId).isPresent()) {
            throw new IllegalArgumentException("L'utente ha già un carrello esistente.");
        }

        Carrello nuovoCarrello = new Carrello();
        nuovoCarrello.setUtente(utenteOpt.get());
        nuovoCarrello.setProdotti(new ArrayList<>());
        return carrelloRepository.save(nuovoCarrello);
    }



}
