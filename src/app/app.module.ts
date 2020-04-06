import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SafeHTML } from './pipes/safe';
import { MyKeyboardService } from './services/keyboard.service';
import { AppComponent } from './app.component';
import { TutContentComponent } from './includes/tut-content.component';
import { TutKbComponent } from './includes/tut-kb.component';
import {FormsModule} from '@angular/forms';
import { TxtInputFocusDirective } from './pipes/txt-input-focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    SafeHTML,
    TutContentComponent,
    TutKbComponent,
    TxtInputFocusDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [MyKeyboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
