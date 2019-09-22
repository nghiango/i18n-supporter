import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashBoardComponent} from '../pages/dash-board/dash-board.component';


const routes: Routes = [
  { path: '', component: DashBoardComponent }
];
@NgModule({
  declarations: [
    DashBoardComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DashBoardRoutingModule { }
