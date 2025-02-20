import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(event: Event): void {
    event.preventDefault();

    if (!this.email || !this.password) {
      this.mostraMessaggioErrore('⚠️ Inserisci email e password!');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response?.token) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/']);
        } else {
          this.mostraMessaggioErrore('❌ Errore di autenticazione.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.gestisciErrore(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private gestisciErrore(error: HttpErrorResponse): void {
    const httpStatus = error.status ?? null;
    const backendMessage = error.error?.message ?? null;

    this.errorMessage = backendMessage || this.getMessaggioErrore(httpStatus);
    this.password = '';
  }

  private getMessaggioErrore(status: number | null): string {
    switch (status) {
      case 400:
        return '⚠️ Email e password sono obbligatorie!';
      case 401:
        return '❌ Credenziali errate. Riprova.';
      case 500:
        return '❌ Errore interno al server.';
      default:
        return '⚠️ Errore di connessione. Controlla la tua rete e riprova.';
    }
  }

  private mostraMessaggioErrore(messaggio: string): void {
    this.errorMessage = messaggio;
    this.isLoading = false;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}
