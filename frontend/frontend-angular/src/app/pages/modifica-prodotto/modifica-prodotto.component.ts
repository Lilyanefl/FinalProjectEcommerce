import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-modifica-prodotto',
  templateUrl: './modifica-prodotto.component.html',
  styleUrls: ['./modifica-prodotto.component.scss'],
})
export class ModificaProdottoComponent implements OnInit {
  prodotto: any = null;
  errorMessage: string = '';
  file: File | null = null;

  tipologie = [
    'T_SHIRT',
    'CAMICIA',
    'VESTITO',
    'PANTALONE',
    'GONNA',
    'JEANS',
    'GIACCA',
    'FELPA',
    'TUTA',
    'SCARPA',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const prodottoId = this.route.snapshot.paramMap.get('id');
    if (prodottoId) {
      this.caricaProdotto(Number(prodottoId));
    }
  }

  private caricaProdotto(prodottoId: number): void {
    this.productService.getProductById(prodottoId).subscribe({
      next: (data) => (this.prodotto = data),
      error: () => (this.errorMessage = '❌ Errore nel recupero del prodotto'),
    });
  }

  salvaModifiche(): void {
    if (!this.prodotto) return;

    if (typeof this.prodotto.taglia === 'string') {
      this.prodotto.taglia = this.prodotto.taglia
        .split(',')
        .map((t: string) => t.trim());
    }
    if (typeof this.prodotto.colore === 'string') {
      this.prodotto.colore = this.prodotto.colore
        .split(',')
        .map((c: string) => c.trim());
    }

    this.productService
      .updateProduct(this.prodotto.id, this.prodotto)
      .subscribe({
        next: () => {
          if (this.file) {
            this.uploadImmagine();
          } else {
            alert('✅ Prodotto aggiornato con successo!');
            this.router.navigate(['/admin/prodotti']);
          }
        },
        error: () =>
          (this.errorMessage = '❌ Errore nella modifica del prodotto'),
      });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  uploadImmagine(): void {
    if (!this.file || !this.prodotto) return;

    this.productService.uploadImage(this.prodotto.id, this.file).subscribe({
      next: () => {
        alert('✅ Immagine caricata con successo!');
        this.router.navigate(['/admin/prodotti']);
      },
      error: () => (this.errorMessage = '❌ Errore nel caricamento immagine'),
    });
  }
}
