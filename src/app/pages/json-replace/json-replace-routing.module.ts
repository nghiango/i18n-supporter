import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JsonReplaceComponent} from './json-replace.component';


const routes: Routes = [
  { path: '', component: JsonReplaceComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class JsonReplaceRoutingModule { }
