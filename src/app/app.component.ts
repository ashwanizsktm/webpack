import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent {
    constructor(private http: HttpClient) {}
    sendData: string = '';
    title = "Angular";
    
    ngOnInit() {
        this.http.get('https://jsonplaceholder.typicode.com/users/1').subscribe(data => {
            this.sendData = data['name']
        })
    }
}