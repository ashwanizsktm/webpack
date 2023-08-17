import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'component',
    templateUrl: './components.component.html',
})

export class ComponentsComponent implements OnInit{
   constructor(private router: Router) {
   }

   ngOnInit(): void {
   }

   goToChild() {
    this.router.navigate(["components/child"]);
   }
}