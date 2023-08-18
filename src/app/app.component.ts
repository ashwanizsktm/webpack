import { Component } from '@angular/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent {
    constructor() {}
    sendData: string = '';
    title = "webpack custom configuratoin with Angular 16";
    
    ngOnInit() {
    }
}