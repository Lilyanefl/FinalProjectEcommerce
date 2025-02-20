import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CarrelloComponent } from './pages/carrello/carrello.component';
import { OrdiniComponent } from './pages/ordini/ordini.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';
import { DettagliOrdineComponent } from './pages/dettagli-ordine/dettagli-ordine.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AdminProdottiComponent } from './pages/admin-prodotti/admin-prodotti.component';
import { ModificaProdottoComponent } from './pages/modifica-prodotto/modifica-prodotto.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { DettagliprodottoComponent } from './pages/dettagliprodotto/dettagliprodotto.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    CarrelloComponent,
    OrdiniComponent,
    RegistrazioneComponent,
    DettagliOrdineComponent,
    WishlistComponent,
    AdminProdottiComponent,
    ModificaProdottoComponent,
    UserProfileComponent,
    DettagliprodottoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
