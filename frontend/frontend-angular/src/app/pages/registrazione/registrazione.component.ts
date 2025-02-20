import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.scss'],
})
export class RegistrazioneComponent {
  nome = '';
  email = '';
  password = '';
  messaggioErrore = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  registrati(): void {
    if (!this.nome.trim() || !this.email.trim() || !this.password.trim()) {
      this.messaggioErrore = '⚠️ Tutti i campi sono obbligatori!';
      return;
    }

    if (!this.emailValida(this.email)) {
      this.messaggioErrore = '⚠️ Inserisci un indirizzo email valido!';
      return;
    }

    this.isLoading = true;

    this.authService
      .registrazione(this.nome, this.email, this.password)
      .subscribe({
        next: () => {
          alert('✅ Registrazione avvenuta con successo! Ora puoi accedere.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
          if (err.error) {
            if (typeof err.error === 'string') {
              this.messaggioErrore = err.error;
            } else if (typeof err.error === 'object' && err.error.error) {
              this.messaggioErrore = err.error.error;
            } else {
              this.messaggioErrore = '❌ Errore sconosciuto.';
            }
          } else {
            this.messaggioErrore = '❌ Si è verificato un errore imprevisto.';
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  private emailValida(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  private gestisciErrore(error: any): string {
    if (error.status === 400) {
      return '⚠️ Tutti i campi sono obbligatori';
    } else if (error.status === 500) {
      return '❌ Errore interno del server. Riprova più tardi.';
    } else if (error.status === 0) {
      return '🌐 Errore di rete. Controlla la tua connessione.';
    } else {
      return '❌ Errore durante la registrazione. Riprova.';
    }
  }
}
