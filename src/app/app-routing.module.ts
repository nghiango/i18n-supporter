import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', loadChildren: './pages/dash-board/dashboard.module#DashboardModule'},
  { path: 'json-replace', loadChildren: './pages/json-replace/json-replace.module#JsonReplaceModule'},
  { path: 'json-tree', loadChildren: './pages/json-tree/json-tree.module#JsonTreeModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
