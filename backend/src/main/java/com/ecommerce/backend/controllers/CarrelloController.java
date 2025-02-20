package com.ecommerce.backend.controllers;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.models.Carrello;
import com.ecommerce.backend.models.CarrelloProdotto;
import com.ecommerce.backend.repository.CarrelloRepository;
import com.ecommerce.backend.services.CarrelloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/carrello")
public class CarrelloController {

    private final CarrelloService carrelloService;
    private final CarrelloRepository carrelloRepository;

    public CarrelloController(CarrelloService carrelloService,CarrelloRepository carrelloRepository) {
        this.carrelloService = carrelloService;
        this.carrelloRepository = carrelloRepository;
    }
    @PostMapping("/{utenteId}/crea")
    public ResponseEntity<Map<String, String>> creaCarrello(@PathVariable Long utenteId) {
        carrelloService.creaCarrello(utenteId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Carrello creato con successo"));
    }


    @GetMapping("/{utenteId}")
    public ResponseEntity<Map<String, Object>> getCarrello(@PathVariable Long utenteId) {
        Carrello carrello = carrelloService.getCarrelloByUtente(utenteId);

        List<Map<String, Object>> prodottiDettagliati = carrello.getProdotti().stream().map(item -> {
            Map<String, Object> prodottoDettagli = new HashMap<>();
            prodottoDettagli.put("id", item.getProdotto().getId());
            prodottoDettagli.put("nome", item.getProdotto().getNome());
            prodottoDettagli.put("descrizione", item.getProdotto().getDescrizione());
            prodottoDettagli.put("prezzo", item.getProdotto().getPrezzo());
            prodottoDettagli.put("quantita", item.getQuantita());
            prodottoDettagli.put("stock", item.getProdotto().getStock());
            prodottoDettagli.put("taglia", item.getTaglia());
            prodottoDettagli.put("colore", item.getColore());
            prodottoDettagli.put("immagineUrl", item.getProdotto().getImmagineUrl());
            return prodottoDettagli;
        }).toList();

        return ResponseEntity.ok(Map.of("prodotti", prodottiDettagliati));
    }

    @PostMapping("/{utenteId}/aggiungi")
    public ResponseEntity<Map<String, String>> aggiungiProdotto(@PathVariable Long utenteId, @RequestBody Map<String, Object> request) {
        if (!request.containsKey("prodottoId") || !request.containsKey("quantita")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Parametri prodottoId e quantita richiesti"));
        }

        Long prodottoId = ((Number) request.get("prodottoId")).longValue();
        int quantita = ((Number) request.get("quantita")).intValue();
        String taglia = (String) request.get("taglia");
        String colore = (String) request.get("colore");
        carrelloService.aggiungiProdottoAlCarrello(utenteId, prodottoId, quantita,taglia,colore);
        return ResponseEntity.ok(Map.of("message", "Prodotto aggiunto al carrello"));
    }

    @PatchMapping("/{utenteId}/aggiungi/{prodottoId}")
    public ResponseEntity<Map<String, String>> incrementaQuantita(@PathVariable Long utenteId,
                                                                  @PathVariable Long prodottoId,
                                                                  @RequestParam String taglia,
                                                                  @RequestParam String colore,
                                                                  @RequestParam int quantita) {
        if (taglia == null || taglia.isEmpty() || colore == null || colore.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Taglia e colore sono obbligatori."));
        }

        carrelloService.incrementaQuantita(utenteId, prodottoId, taglia, colore, quantita);
        return ResponseEntity.ok(Map.of("message", "Quantità aumentata con successo"));
    }


    @DeleteMapping("/{utenteId}/rimuovi/{prodottoId}")
    public ResponseEntity<Map<String, String>> rimuoviProdotto(
            @PathVariable Long utenteId,
            @PathVariable Long prodottoId,
            @RequestBody Map<String, String> request) { // ✅ Riceve il body con taglia e colore

        String taglia = request.get("taglia");
        String colore = request.get("colore");

        carrelloService.rimuoviProdottoDalCarrello(utenteId, prodottoId, taglia, colore);
        return ResponseEntity.ok(Map.of("message", "Prodotto rimosso con successo"));
    }


    @PatchMapping("/{utenteId}/rimuovi/{prodottoId}")
    public ResponseEntity<?> rimuoviQuantitaProdotto(@PathVariable Long utenteId,
                                                     @PathVariable Long prodottoId,
                                                     @RequestParam String taglia,
                                                     @RequestParam String colore,
                                                     @RequestParam(defaultValue = "1") int quantita) {
            carrelloService.rimuoviQuantitaDalCarrello(utenteId, prodottoId, taglia, colore, quantita);
            return ResponseEntity.ok(Map.of("message", "Quantità aggiornata con successo"));
        }


    @DeleteMapping("/{utenteId}/svuota")
    public ResponseEntity<Map<String, String>> svuotaCarrello(@PathVariable Long utenteId) {
        carrelloService.svuotaCarrello(utenteId);
        return ResponseEntity.ok(Map.of("message", "Carrello svuotato con successo"));
    }
}
