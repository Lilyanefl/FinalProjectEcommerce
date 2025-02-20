package com.ecommerce.backend.services;

import com.ecommerce.backend.exceptions.ResourceNotFoundException;
import com.ecommerce.backend.exceptions.ValidationException;
import com.ecommerce.backend.models.OrdineProdotto;
import com.ecommerce.backend.models.Prodotto;
import com.ecommerce.backend.repository.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;
    private final CarrelloProdottoRepository carrelloProdottoRepository;
    private final OrdineRepository ordineRepository;
    private final WishlistRepository wishlistRepository;
    private final CarrelloRepository carrelloRepository;
    private final String uploadDir = "uploads/";

    public ProdottoService(ProdottoRepository prodottoRepository, OrdineRepository ordineRepository, WishlistRepository wishlistRepository, CarrelloRepository carrelloRepository, CarrelloProdottoRepository carrelloProdottoRepository) {
        this.prodottoRepository = prodottoRepository;
        this.wishlistRepository = wishlistRepository;
        this.carrelloRepository = carrelloRepository;
        this.carrelloProdottoRepository= carrelloProdottoRepository;
        this.ordineRepository = ordineRepository;
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new RuntimeException("Errore nella creazione della cartella upload");
            }
        }
    }

    public List<Prodotto> getAllProducts() {
        return prodottoRepository.findAll();
    }

    public Prodotto getProductById(Long id) {
        return prodottoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto con ID " + id + " non trovato."));
    }

    public Prodotto createProduct(Prodotto prodotto) {
        List<String> errors = new ArrayList<>();

        if (prodotto.getNome() == null || prodotto.getNome().trim().isEmpty()) {
            errors.add("Il nome del prodotto è obbligatorio.");
        }
        if (prodotto.getDescrizione() == null || prodotto.getDescrizione().trim().isEmpty()) {
            errors.add("La descrizione del prodotto è obbligatoria.");
        }
        if (prodotto.getPrezzo() == null || prodotto.getPrezzo() <= 0) {
            errors.add("Il prezzo del prodotto deve essere maggiore di 0.");
        }
        if (prodotto.getStock() < 0) {
            errors.add("Lo stock non può essere negativo.");
        }
        if (prodotto.getTipologia() == null) {
            errors.add("La tipologia del prodotto è obbligatoria.");
        }
        if (prodotto.getTaglia() == null) {
            errors.add("La taglia è obbligatoria, almeno una.");
        }
        if (prodotto.getColore() == null) {
            errors.add("Il colore è obbligatorio, almeno uno.");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        try {
            return prodottoRepository.save(prodotto);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Errore di integrità del database: " + e.getMessage());
        }
    }


    public Prodotto updateProduct(Long id, Prodotto newProduct) {
        return prodottoRepository.findById(id).map(prod -> {
            prod.setNome(newProduct.getNome());
            prod.setDescrizione(newProduct.getDescrizione());
            prod.setPrezzo(newProduct.getPrezzo());
            prod.setStock(newProduct.getStock());
            prod.setCodice(newProduct.getCodice());
            prod.setTipologia(newProduct.getTipologia());
            prod.setImmagineUrl(newProduct.getImmagineUrl());
            prod.setTaglia(newProduct.getTaglia());
            prod.setColore(newProduct.getColore()); 
            return prodottoRepository.save(prod);
        }).orElseThrow(() -> new ResourceNotFoundException("Prodotto con ID " + id + " non trovato."));
    }

    public void deleteProduct(Long id) {
        if (!prodottoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prodotto con ID " + id + " non trovato.");
        }
        prodottoRepository.deleteById(id);
    }

    public String salvaImmagine(Long prodottoId, MultipartFile file) throws IOException {
        Prodotto prodotto = prodottoRepository.findById(prodottoId)
                .orElseThrow(() -> new IllegalArgumentException("Prodotto non trovato"));

        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        prodotto.setImmagineUrl(filePath.toString());
        prodottoRepository.save(prodotto);

        return filePath.toString();
    }
}
