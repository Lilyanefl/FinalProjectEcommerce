import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-prodotti',
  templateUrl: './admin-prodotti.component.html',
  styleUrls: ['./admin-prodotti.component.scss'],
})
export class AdminProdottiComponent implements OnInit {
  prodotti: any[] = [];
  errorMessage: string = '';
  erroreTaglia = false;
  fileToUpload: File | null = null;

  nuovoProdotto = {
    nome: '',
    descrizione: '',
    prezzo: null,
    stock: null,
    codice: '',
    tipologia: '',
    immagineUrl: '',
    taglia: '',
    colore: '',
  };
  tipologie: string[] = [
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
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.caricaProdotti();
  }

  private caricaProdotti(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.prodotti = data),
      error: () => (this.errorMessage = '❌ Errore nel recupero dei prodotti'),
    });
  }
  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  creaProdotto(): void {
    this.productService
      .createProduct({
        ...this.nuovoProdotto,
        taglia: this.nuovoProdotto.taglia.split(',').map((t) => t.trim()),
        colore: this.nuovoProdotto.colore.split(',').map((c) => c.trim()),
      })
      .subscribe({
        next: (prodotto) => {
          if (this.fileToUpload) {
            this.productService
              .uploadImage(prodotto.id, this.fileToUpload)
              .subscribe(() => {
                this.caricaProdotti();
                this.resetForm();
              });
          } else {
            this.caricaProdotti();
          }
        },
        error: (err) => {
          if (err?.error?.details) {
            this.errorMessage = Array.isArray(err.error.details)
              ? err.error.details.join('\n')
              : err.error.details;
          } else {
            this.errorMessage = '❌ Si è verificato un errore imprevisto.';
          }
        },
      });
  }

  modificaProdotto(prodotto: any): void {
    this.productService
      .updateProduct(prodotto.id, {
        ...prodotto,
        taglia:
          typeof prodotto.taglia === 'string'
            ? prodotto.taglia.split(',').map((t: any) => t.trim())
            : prodotto.taglia,
        colore:
          typeof prodotto.colore === 'string'
            ? prodotto.colore.split(',').map((c: any) => c.trim())
            : prodotto.colore,
      })
      .subscribe({
        next: () => this.caricaProdotti(),
        error: () =>
          (this.errorMessage = '❌ Errore nella modifica del prodotto'),
      });
  }

  eliminaProdotto(prodottoId: number): void {
    this.productService.deleteProduct(prodottoId).subscribe({
      next: () => this.caricaProdotti(),
      error: () =>
        (this.errorMessage = '❌ Errore nella cancellazione del prodotto'),
    });
  }

  private resetForm(): void {
    this.nuovoProdotto = {
      nome: '',
      descrizione: '',
      prezzo: null,
      stock: null,
      codice: '',
      tipologia: '',
      immagineUrl: '',
      taglia: '',
      colore: '',
    };
  }

  controllaNumero() {
    const regex = /^[0-9, ]*$/;
    if (!regex.test(this.nuovoProdotto.taglia)) {
      this.nuovoProdotto.taglia = '';
      this.erroreTaglia = true;
    } else {
      this.erroreTaglia = false;
    }
  }
  verificaNumero(event: KeyboardEvent) {
    const regex = /[0-9.]|\b/g;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
}
