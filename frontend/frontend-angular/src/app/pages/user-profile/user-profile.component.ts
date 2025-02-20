import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  utenteId: number | null = null;
  utente: any = {};
  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utenteId = this.authService.getUserIdFromToken();
    if (!this.utenteId) {
      this.router.navigate(['/login']);
      return;
    }
    this.caricaDatiUtente();
  }

  caricaDatiUtente(): void {
    if (!this.utenteId) return;
    this.userService.getUserInfo(this.utenteId).subscribe({
      next: (data: any) => (this.utente = data),
      error: () => (this.errorMessage = '❌ Errore nel recupero dei dati'),
    });
  }

  abilitaModifica(): void {
    this.isEditing = true;
  }

  salvaModifiche(): void {
    if (!this.utenteId) return;
    this.userService.updateUser(this.utenteId, this.utente).subscribe({
      next: () => {
        this.isEditing = false;
        alert('✅ Dati aggiornati con successo!');
      },
      error: () => (this.errorMessage = '❌ Errore nel salvataggio dei dati'),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  annullaModifica() {
    this.isEditing = false;
  }
}
