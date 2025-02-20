import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  prodotti: any[] = [];
  prodottiFiltrati: any[] = [];
  wishlist: Set<number> = new Set();
  searchQuery: string = '';
  filtroOrdine: string = 'default';
  erroreMessaggio: string = '';
  successoMessaggio: string = '';
  utenteId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.utenteId = this.authService.getUserIdFromToken();
      this.caricaWishlist();
      this.verificaECreaCarrello();
    }
    this.caricaProdotti();
  }
  private verificaECreaCarrello(): void {
    if (!this.utenteId) return;
    this.cartService.getCarrello(this.utenteId).subscribe({
      next: (carrello) => {
        console.log('✅ Carrello già esistente:', carrello);
      },
      error: (err) => {
        if (err.message.includes('Status: 404')) {
          this.cartService.creaCarrello(this.utenteId!).subscribe({
            next: () => {
              console.log('✅ Carrello creato con successo.');
            },
            error: () => {
              this.erroreMessaggio = '❌ Errore nella creazione del carrello.';
              this.clearMessage();
            },
          });
        } else {
          this.erroreMessaggio = '❌ Errore nel recupero del carrello.';
          this.clearMessage();
        }
      },
    });
  }

  caricaProdotti(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.prodotti = data.map((prodotto: any) => ({
          ...prodotto,
          taglie: prodotto.taglie ?? [],
          colori: prodotto.colori ?? [],
          tagliaSelezionata: '',
          coloreSelezionato: '',
        }));

        this.prodottiFiltrati = [...this.prodotti];
      },
      error: () => {
        this.erroreMessaggio = '❌ Errore nel recupero dei prodotti.';
        this.clearMessage();
      },
    });
  }

  private caricaWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (data) =>
        (this.wishlist = new Set(data.map((item: any) => item.prodotto.id))),
      error: () => {
        this.erroreMessaggio = '❌ Errore nel recupero della wishlist.';
        this.clearMessage();
      },
    });
  }

  aggiungiAlCarrello(prodotto: any): void {
    this.erroreMessaggio = '';
    this.successoMessaggio = '';
    const userId = this.authService.getUserIdFromToken();
    if (prodotto.stock < 1) {
      this.erroreMessaggio =
        '❌ Prodotto esaurito! Non puoi aggiungerlo al carrello.';
      this.clearMessage();
      return;
    }
    if (userId === null) {
      this.erroreMessaggio = '❌ Errore: utente non identificato.';
      this.clearMessage();
      return;
    }
    if (!this.isloggedInCarrelloWishlist()) {
      this.erroreMessaggio =
        '❌ Devi essere loggato per aggiungere al carrello!';
      this.clearMessage();
      return;
    }
    if (!prodotto.tagliaSelezionata || !prodotto.coloreSelezionato) {
      this.erroreMessaggio =
        '⚠️ Seleziona taglia e colore prima di aggiungere al carrello!';
      this.clearMessage();
      return;
    }
    this.cartService.getCarrello(userId).subscribe({
      next: (carrello) => {
        const prodottoEsistente = carrello.prodotti.find(
          (p: any) =>
            p.id === prodotto.id &&
            p.taglia === prodotto.tagliaSelezionata &&
            p.colore === prodotto.coloreSelezionato
        );
        const quantitaAttuale = prodottoEsistente
          ? prodottoEsistente.quantita
          : 0;
        if (quantitaAttuale + 1 > prodotto.stock) {
          this.erroreMessaggio =
            'Errore! Questo articolo con il tuo ordine sarebbe terminato, non puoi aggiungerne altri!';
          this.clearMessage();
          return;
        }
        this.cartService
          .aggiungiAlCarrello(
            userId,
            prodotto.id,
            1,
            prodotto.tagliaSelezionata,
            prodotto.coloreSelezionato
          )
          .subscribe({
            next: () => {
              this.successoMessaggio = '✅ Prodotto aggiunto al carrello!';
              this.clearMessage();
            },
            error: () => {
              console.error("❌ Errore nell'aggiunta al carrello!");
              this.erroreMessaggio = "❌ Errore nell'aggiunta al carrello!";
              this.clearMessage();
            },
          });
      },
      error: () => {
        console.error('❌ Errore nel recupero del carrello!');
        this.erroreMessaggio = '❌ Errore nel recupero del carrello!';
        this.clearMessage();
      },
    });
  }

  toggleWishlist(prodottoId: number): void {
    this.erroreMessaggio = '';
    this.successoMessaggio = '';

    if (!this.isloggedInCarrelloWishlist()) {
      this.erroreMessaggio = '❌ Devi essere loggato per usare la wishlist!';
      this.clearMessage();
      return;
    }

    if (this.wishlist.has(prodottoId)) {
      this.successoMessaggio = '';
      this.wishlistService.rimuoviDallaWishlist(prodottoId).subscribe({
        next: () => {
          this.wishlist.delete(prodottoId);
          this.successoMessaggio = '❌ Prodotto rimosso dalla wishlist!';
          this.clearMessage();
        },
        error: () => {
          console.error('❌ Errore nella rimozione dalla wishlist');
          this.erroreMessaggio = '❌ Errore nella rimozione dalla wishlist!';
          this.clearMessage();
        },
      });
    } else {
      this.wishlistService.aggiungiAllaWishlist(prodottoId).subscribe({
        next: () => {
          this.successoMessaggio = '';
          this.wishlist.add(prodottoId);
          this.successoMessaggio = '✅ Prodotto aggiunto alla wishlist!';
          this.clearMessage();
        },
        error: () => {
          console.error("❌ Errore nell'aggiunta alla wishlist");
          this.erroreMessaggio = "❌ Errore nell'aggiunta alla wishlist!";
          this.clearMessage();
        },
      });
    }
  }

  filtraProdotti(): void {
    this.prodottiFiltrati = this.prodotti.filter((prodotto) =>
      prodotto.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.ordinaProdotti();
  }

  ordinaProdotti(): void {
    const sortingMap: { [key: string]: (a: any, b: any) => number } = {
      'prezzo-asc': (a, b) => a.prezzo - b.prezzo,
      'prezzo-desc': (a, b) => b.prezzo - a.prezzo,
      'nome-asc': (a, b) => a.nome.localeCompare(b.nome),
      'nome-desc': (a, b) => b.nome.localeCompare(a.nome),
    };

    if (this.filtroOrdine in sortingMap) {
      this.prodottiFiltrati.sort(sortingMap[this.filtroOrdine]);
    }
  }

  aggiornaOrdinamento(): void {
    this.ordinaProdotti();
  }

  isloggedInCarrelloWishlist(): boolean {
    const loggedIn = this.authService.isLoggedIn();

    if (!loggedIn) {
      console.error("❌ Errore: l'utente non è loggato!");
      this.erroreMessaggio = "❌ Errore: l'utente non è loggato!";
      this.clearMessage();
    }

    return loggedIn;
  }
  private clearMessage(): void {
    setTimeout(() => {
      this.erroreMessaggio = '';
      this.successoMessaggio = '';
    }, 10000);
  }

  vaiAiDettagli(prodottoId: number) {
    this.router.navigate(['/prodotto', prodottoId]);
  }
}
