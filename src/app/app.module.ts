
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import '../styles/styles.scss';
import { AppRoutingModule } from "./app.routing.module";
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent, 
  ],
  
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule
  ],

  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],

  bootstrap: [AppComponent],
})

export class AppModule {}