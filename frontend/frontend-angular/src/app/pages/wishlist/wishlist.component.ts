import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  messaggio: string = '';
  isLoading: boolean = false;
  utenteId: number | null = null;

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.utenteId = this.authService.getUserIdFromToken();

    if (!this.utenteId) {
      this.messaggio = '❌ Devi essere loggato per vedere la wishlist!';
      return;
    }

    this.caricaWishlist();
  }

  caricaWishlist(): void {
    this.isLoading = true;

    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        console.log('📦 Wishlist ricevuta:', data);
        this.wishlist = data;
        if (this.wishlist.length === 0) {
          this.messaggio = 'La wishlist è vuota.';
        }
      },
      error: (err) => {
        console.error('❌ Errore nel recupero della wishlist', err);
        this.messaggio = '⚠️ Errore nel caricamento della wishlist.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  rimuoviDallaWishlist(prodottoId: number): void {
    if (!this.utenteId) return;

    this.wishlistService.rimuoviDallaWishlist(prodottoId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(
          (p) => p.prodotto.id !== prodottoId
        );
        this.messaggio = '✅ Prodotto rimosso dalla wishlist!';
        setTimeout(() => (this.messaggio = ''), 3000);
      },
      error: (err) => {
        console.error('❌ Errore nella rimozione dalla wishlist', err);
        this.messaggio = '⚠️ Errore nella rimozione del prodotto.';
      },
    });
  }
}
