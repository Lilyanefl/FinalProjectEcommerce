import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dettagli-ordine',
  templateUrl: './dettagli-ordine.component.html',
  styleUrls: ['./dettagli-ordine.component.scss'],
})
export class DettagliOrdineComponent implements OnInit {
  ordine: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const ordineId = this.route.snapshot.paramMap.get('id');

    if (ordineId) {
      this.caricaDettagliOrdine(Number(ordineId));
    }
  }

  private caricaDettagliOrdine(ordineId: number): void {
    this.orderService.getDettagliOrdine(ordineId).subscribe({
      next: (data) => {
        if (data) {
          this.ordine = data;
          console.log('📦 Dati ordine ricevuti:', this.ordine);

          if (this.ordine.prodotti && this.ordine.prodotti.length > 0) {
            console.log('🛒 Prodotti:', this.ordine.prodotti);

            this.ordine.prodotti.forEach((prodotto: any, index: number) => {
              console.log(`🔍 Prodotto ${index + 1}:`, prodotto);
            });
          } else {
            console.warn('⚠️ Nessun prodotto associato a questo ordine.');
          }
        } else {
          this.errorMessage = '⚠️ Nessun dettaglio trovato per questo ordine.';
        }
      },
      error: (err) => {
        console.error("❌ Errore nel recupero dei dettagli dell'ordine", err);
        this.errorMessage =
          "❌ Errore nel recupero dei dettagli dell'ordine. Riprova più tardi.";
      },
    });
  }
}
