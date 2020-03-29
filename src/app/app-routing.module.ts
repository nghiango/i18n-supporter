import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/json-tree', pathMatch: 'full'},
  { path: 'dashboard', loadChildren: () => import('./pages/dash-board/dashboard.module').then(m => m.DashboardModule)},
  { path: 'json-replace', loadChildren: () => import('./pages/json-replace/json-replace.module').then(m => m.JsonReplaceModule)},
  { path: 'json-tree', loadChildren: () => import('./pages/json-tree/json-tree.module').then(m => m.JsonTreeModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
