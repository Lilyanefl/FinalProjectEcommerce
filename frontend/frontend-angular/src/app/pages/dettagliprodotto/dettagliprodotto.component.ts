import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dettagliprodotto',
  templateUrl: './dettagliprodotto.component.html',
  styleUrls: ['./dettagliprodotto.component.scss'],
})
export class DettagliprodottoComponent implements OnInit {
  prodottoId: number | null = null;
  prodotto: any = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.prodottoId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.prodottoId).subscribe(
      (data) => {
        this.prodotto = data;
      },
      (error) => {
        console.error('Errore nel recupero del prodotto', error);
        this.router.navigate(['/']);
      }
    );
  }

  tornaIndietro() {
    this.router.navigate(['/']);
  }
}
