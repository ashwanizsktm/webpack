import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChildComponent } from "./child/child.component";
import { componentsRoutingModule } from "./components.routing.module";
import { RouterModule } from "@angular/router";


@NgModule({
    declarations: [
        ChildComponent
    ],

    imports: [
        CommonModule,
        RouterModule,
        componentsRoutingModule
    ],
})

export class ComponentsModule { }