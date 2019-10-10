import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JsonTreeComponent} from './json-tree.component';

const routes: Routes = [
  { path: '', component: JsonTreeComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class JsonTreeRoutingModule { }
