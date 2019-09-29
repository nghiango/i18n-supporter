import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashBoardComponent} from '../pages/dash-board/dash-board.component';
import {SquareComponent} from '../components/square/square.component';
import {JsonReplaceComponent} from '../components/json-replace/json-replace.component';


const routes: Routes = [
  { path: '', component: DashBoardComponent, children: [
      {path: 'json-replace', component: JsonReplaceComponent}
    ]},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashBoardRoutingModule { }
