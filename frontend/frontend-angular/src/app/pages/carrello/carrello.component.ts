import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss'],
})
export class CarrelloComponent implements OnInit {
  utenteId: number | null = null;
  carrello: any = { prodotti: [] };
  errorMessage: string = '';
  stock: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utenteId = this.authService.getUserIdFromToken();
    if (this.utenteId) {
      this.caricaCarrello();
    }
  }

  private caricaCarrello(): void {
    if (!this.utenteId) return;
    this.cartService.getCarrello(this.utenteId).subscribe({
      next: (response) => {
        console.log('✅ Carrello ricevuto:', response);

        response.prodotti.forEach((nuovoProdotto: any) => {
          const prodottoEsistente = this.carrello.prodotti.find(
            (p: any) =>
              p.id === nuovoProdotto.id &&
              p.taglia === nuovoProdotto.taglia &&
              p.colore === nuovoProdotto.colore
          );
          this.stock = nuovoProdotto.stock;
          console.log(this.stock);

          if (prodottoEsistente) {
            prodottoEsistente.quantita = nuovoProdotto.quantita;
          } else {
            this.carrello.prodotti.push(nuovoProdotto);
          }
        });
        this.carrello.prodotti.sort((a: any, b: any) => a.id - b.id);
      },
    });
  }
  checkout(): void {
    if (!this.utenteId) return;
    this.orderService.checkout(this.utenteId).subscribe({
      next: () => {
        alert('✅ Ordine creato con successo!');
        this.router.navigate(['/ordini']);
      },
      error: (err) => {
        this.errorMessage = '❌ Errore nel checkout.';
        this.clearErrorMessage();
        console.error('Errore:', err);
      },
    });
  }

  rimuoviProdotto(prodottoId: number, taglia: string, colore: string): void {
    if (!this.utenteId) return;

    this.cartService
      .rimuoviDalCarrello(this.utenteId, prodottoId, taglia, colore)
      .subscribe({
        next: () => {
          this.carrello.prodotti = this.carrello.prodotti.filter(
            (p: any) =>
              !(
                p.id === prodottoId &&
                p.taglia === taglia &&
                p.colore === colore
              )
          );

          setTimeout(() => {
            this.caricaCarrello();
          }, 500);
        },
        error: (err) => {
          this.errorMessage = '❌ Errore nella rimozione del prodotto.';
          this.clearErrorMessage();
          console.error('Errore:', err);
        },
      });
  }

  rimuoviQuantita(prodottoId: number, taglia: string, colore: string): void {
    if (!this.utenteId) return;
    this.cartService
      .rimuoviQuantitaDalCarrello(this.utenteId, prodottoId, taglia, colore, 1)
      .subscribe({
        next: () => this.caricaCarrello(),
        error: (err) => {
          this.errorMessage = '❌ Errore nella modifica della quantità.';
          this.clearErrorMessage();
          console.error('Errore:', err);
        },
      });
  }

  aggiungiQuantita(prodottoId: number, taglia: string, colore: string): void {
    if (!this.utenteId) return;
    const prodotto = this.carrello.prodotti.find(
      (p: any) =>
        p.id === prodottoId && p.taglia === taglia && p.colore === colore
    );
    if (prodotto.quantita + 1 > prodotto.stock) {
      this.errorMessage = `❌ Superato il limite di disponibilità, impossibile aggiungere.`;
      this.clearErrorMessage();
      return;
    }
    this.cartService
      .aumentaQuantita(this.utenteId, prodottoId, taglia, colore, 1)
      .subscribe({
        next: () => this.caricaCarrello(),
        error: (err) => {
          this.errorMessage = '❌ Errore nell’aumento della quantità.';
          this.clearErrorMessage();
          console.error('Errore:', err);
        },
      });
  }

  svuotaCarrello(): void {
    if (!this.utenteId) return;
    this.cartService.svuotaCarrello(this.utenteId).subscribe({
      next: () => this.caricaCarrello(),
      error: (err) => {
        this.errorMessage = '❌ Errore nello svuotamento del carrello.';
        this.clearErrorMessage();
        console.error('Errore:', err);
      },
    });
  }

  getTotaleCarrello(): number {
    return this.carrello.prodotti.reduce((totale: number, prodotto: any) => {
      return totale + prodotto.prezzo * prodotto.quantita;
    }, 0);
  }
  private clearErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = '';
    }, 30000);
  }
}
