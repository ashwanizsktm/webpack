import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'products',
    templateUrl: './products.component.html',
})

export class ProductsComponent implements OnInit{
   constructor(private router: Router) {
   }

   ngOnInit(): void {
   }

   goToCar() {
    this.router.navigate(["/car"]);
   }

   goToCloths() {
    this.router.navigate(["/cloths"]);
   }
}