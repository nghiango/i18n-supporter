import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashBoardComponent} from '../pages/dash-board/dash-board.component';
import {SquareComponent} from '../components/square/square.component';


const routes: Routes = [
  { path: '', component: DashBoardComponent },
];
@NgModule({
  declarations: [
    DashBoardComponent,
    SquareComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DashBoardRoutingModule { }
