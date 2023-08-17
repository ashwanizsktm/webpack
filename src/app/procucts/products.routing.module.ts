
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { CarComponent } from './components/car/car.component';
import { ClothsComponent } from './components/cloths/cloths.component';


const routes: Routes = [
    {
        path: 'products', component: ProductsComponent,
        children: [
            { path: 'car', component: CarComponent },
            { path: 'cloths', component: ClothsComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProductssRoutingModule { }