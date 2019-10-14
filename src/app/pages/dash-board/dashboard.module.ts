import {NgModule} from '@angular/core';
import {DashBoardComponent} from './dash-board.component';
import {SquareComponent} from '../../components/square/square.component';
import {DashBoardRoutingModule} from './dash-board-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    DashBoardComponent,
    SquareComponent,
  ],
  imports: [
    DashBoardRoutingModule,
    SharedModule,

  ]
})
export class DashboardModule { }
