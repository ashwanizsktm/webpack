import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {path: '', component: AppComponent},

  {
    path: 'components',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
  },

  {
    path: 'products',
    loadChildren: () => import('./procucts/products.module').then(m => m.ProductsModule)
  },
 

//   {path: '**', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }