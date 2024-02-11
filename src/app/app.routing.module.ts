import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
	{
		path: 'customers',
		loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
	},
	{
		path: 'products',
		loadChildren: () => import('./procucts/products.module').then(m => m.ProductsModule)
	},
	{ path: '**', redirectTo: '/', pathMatch: 'full' }

];

@NgModule({
	imports: [RouterModule.forRoot(routes,
		{
			preloadingStrategy: PreloadAllModules
		})],
	exports: [RouterModule]
})
export class AppRoutingModule { }