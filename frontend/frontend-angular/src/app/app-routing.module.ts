import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';

import { CarrelloComponent } from './pages/carrello/carrello.component';
import { OrdiniComponent } from './pages/ordini/ordini.component';
import { DettagliOrdineComponent } from './pages/dettagli-ordine/dettagli-ordine.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

import { AdminProdottiComponent } from './pages/admin-prodotti/admin-prodotti.component';
import { ModificaProdottoComponent } from './pages/modifica-prodotto/modifica-prodotto.component';

import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { DettagliprodottoComponent } from './pages/dettagliprodotto/dettagliprodotto.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: 'registrazione',
    component: RegistrazioneComponent,
    canActivate: [NoAuthGuard],
  },

  {
    path: 'profilo',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'carrello', component: CarrelloComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'ordini', component: OrdiniComponent, canActivate: [AuthGuard] },
  {
    path: 'ordini/:id',
    component: DettagliOrdineComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'admin/prodotti',
    component: AdminProdottiComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/prodotti/modifica/:id',
    component: ModificaProdottoComponent,
    canActivate: [AdminGuard],
  },
  { path: 'prodotto/:id', component: DettagliprodottoComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
