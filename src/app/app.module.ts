import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SafeHTML } from './pipes/safe';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeHTML
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
