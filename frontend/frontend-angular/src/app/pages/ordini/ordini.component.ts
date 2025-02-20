import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.scss'],
})
export class OrdiniComponent implements OnInit {
  ordini: any[] = [];
  errorMessage = '';
  isLoading = false;
  utenteId: number | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utenteId = this.authService.getUserIdFromToken();
    if (!this.utenteId) {
      this.errorMessage = '⚠️ Devi essere loggato per visualizzare gli ordini!';
      return;
    }

    this.caricaOrdini();
  }

  caricaOrdini(): void {
    if (!this.utenteId) return;

    this.isLoading = true;
    this.orderService.getOrdiniUtente(this.utenteId).subscribe({
      next: (data) => {
        this.ordini = data;
        if (this.ordini.length === 0) {
          this.errorMessage = '📦 Nessun ordine trovato.';
        }
      },
      error: (error) => {
        console.error('❌ Errore nel recupero ordini:', error);
        this.errorMessage = this.gestisciErrore(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  vaiADettagli(ordineId: number): void {
    this.router.navigate(['/ordini', ordineId]);
  }

  private gestisciErrore(error: any): string {
    if (error.status === 404) {
      return '⚠️ Nessun ordine trovato per questo utente.';
    } else if (error.status === 500) {
      return '❌ Errore interno del server. Riprova più tardi.';
    } else if (error.status === 0) {
      return '🌐 Errore di rete. Controlla la tua connessione.';
    } else {
      return '❌ Errore imprevisto nel recupero degli ordini.';
    }
  }
}
