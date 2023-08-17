
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsComponent } from './components.component';
import { ChildComponent } from './child/child.component';



const routes: Routes = [
    {
        path: 'components', component: ComponentsComponent,
        children: [
            {path: 'child', component: ChildComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class componentsRoutingModule { }