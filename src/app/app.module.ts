import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SafeHTML } from './pipes/safe';
import { MyKeyboardService } from './services/keyboard.service';
import { AppComponent } from './app.component';
import { TutContentComponent } from './includes/tut-content.component';
import { TutKbComponent } from './includes/tut-kb.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeHTML,
    TutContentComponent,
    TutKbComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MyKeyboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
