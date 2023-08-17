import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CarComponent } from './components/car/car.component';
import { ClothsComponent } from './components/cloths/cloths.component';
import { ProductssRoutingModule } from './products.routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
     CarComponent,
     ClothsComponent
  ],
  
  imports: [
    CommonModule,
    ProductssRoutingModule,
    RouterModule
  ],
})

export class ProductsModule {}