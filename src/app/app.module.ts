import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CreateOwnerComponent } from './create-owner/create-owner.component';
import { CommonModule } from '@angular/common';
import { LoggedinComponent } from './loggedin/loggedin.component';
import { HistoryComponent } from './history/history.component';
import { PiechartComponent } from './piechart/piechart.component';
import { importProvidersFrom } from '@angular/core';
import { StockComponent } from './stock/stock.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateOwnerComponent,
    LoggedinComponent,
    HistoryComponent,
    PiechartComponent,
    StockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule 
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
