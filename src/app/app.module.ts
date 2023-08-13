
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import '../styles/styles.scss';
import { HttpClientModule } from "@angular/common/http";
import { ComponentsModule } from "./components/components.module";


@NgModule({
  declarations: [
    AppComponent, 
  ],
  
  imports: [
    BrowserModule,
    CommonModule,
    ComponentsModule,
    HttpClientModule
  ],

  bootstrap: [AppComponent],
})

export class AppModule {}