package com.ecommerce.backend.services;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.models.*;
import com.ecommerce.backend.repository.OrdineRepository;
import com.ecommerce.backend.repository.CarrelloRepository;
import com.ecommerce.backend.repository.CarrelloProdottoRepository;
import com.ecommerce.backend.repository.ProdottoRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final CarrelloRepository carrelloRepository;
    private final CarrelloProdottoRepository carrelloProdottoRepository;
    private final ProdottoRepository prodottoRepository;

    public OrdineService(OrdineRepository ordineRepository, CarrelloRepository carrelloRepository, CarrelloProdottoRepository carrelloProdottoRepository, ProdottoRepository prodottoRepository) {
        this.ordineRepository = ordineRepository;
        this.carrelloRepository = carrelloRepository;
        this.carrelloProdottoRepository = carrelloProdottoRepository;
        this.prodottoRepository=prodottoRepository;
    }

    public List<Ordine> getAllOrders() {
        return ordineRepository.findAll();
    }

    public List<Ordine> getOrdersByUserId(Long utenteId) {
        return ordineRepository.findByUtenteId(utenteId);
    }

    public Ordine getOrderById(Long id) {
        return ordineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordine con ID " + id + " non trovato."));
    }

    @Transactional
    public Ordine createOrderFromCart(Long utenteId) {
        Carrello carrello = carrelloRepository.findByUtenteId(utenteId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrello per l'utente ID " + utenteId + " non trovato."));

        if (carrello.getProdotti().isEmpty()) {
            throw new IllegalStateException("⚠️ Il carrello è vuoto! Non puoi procedere con l'ordine.");
        }

        for (CarrelloProdotto cp : carrello.getProdotti()) {
            Prodotto prodotto = cp.getProdotto();
            if (prodotto.getStock() < cp.getQuantita()) {
                throw new IllegalStateException("Stock insufficiente per il prodotto: " + prodotto.getNome());
            }
        }

        Ordine ordine = new Ordine();
        ordine.setUtente(carrello.getUtente());
        ordine.setTotale(carrello.getProdotti().stream()
                .mapToDouble(p -> p.getPrezzoUnitario() * p.getQuantita()).sum());
        ordine.setStato("IN_ELABORAZIONE");

        ordine.setProdotti(carrello.getProdotti().stream()
                .map(prod -> new OrdineProdotto(ordine, prod.getProdotto(), prod.getQuantita(), prod.getPrezzoUnitario()))
                .collect(Collectors.toList()));

        Ordine ordineSalvato = ordineRepository.save(ordine);

        for (CarrelloProdotto cp : carrello.getProdotti()) {
            Prodotto prodotto = cp.getProdotto();
            prodotto.setStock(prodotto.getStock() - cp.getQuantita());
            prodottoRepository.save(prodotto);
        }

        carrelloProdottoRepository.deleteAllByCarrelloId(carrello.getId());

        return ordineSalvato;
    }


    public void deleteOrder(Long id) {
        if (!ordineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ordine con ID " + id + " non trovato.");
        }
        ordineRepository.deleteById(id);
    }

    @Transactional
    public Ordine aggiornaStatoOrdine(Long id, String nuovoStato) {
        Ordine ordine = ordineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordine con ID " + id + " non trovato."));

        if (nuovoStato == null || nuovoStato.isEmpty()) {
            throw new IllegalArgumentException("Lo stato dell'ordine non può essere vuoto.");
        }

        ordine.setStato(nuovoStato);
        return ordineRepository.save(ordine);
    }
}
