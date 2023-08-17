import { Component, OnInit } from '@angular/core';
export interface customerDetails {
    name: string;
    age: number;
    address: string;
}
@Component({
    selector: 'customers',
    templateUrl: './customers.component.html',
})

export class CustomersComponent implements OnInit {


    customerDetails: customerDetails[] = [
        { name: 'kate', age: 27, address: 'US' },
        { name: 'Jane', age: 32, address: 'Australia' },
        { name: 'Rakesh', age: 21, address: 'India' }
    ]

    ngOnInit(): void {
    }

    trackCustomerDetailsFn(index, item):void{
            return item.name;
    }
}