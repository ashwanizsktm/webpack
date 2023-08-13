import { Component, Input } from '@angular/core';

@Component({
    selector: 'child',
    templateUrl: './child.component.html',
})

export class ChildComponent {
     data_value: string = '';
    @Input() set getData(data) {
        this.data_value = data;
    }

    constructor() {}
}