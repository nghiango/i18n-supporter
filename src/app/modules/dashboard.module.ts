import {NgModule} from '@angular/core';
import {DashBoardComponent} from '../pages/dash-board/dash-board.component';
import {SquareComponent} from '../components/square/square.component';
import {JsonReplaceComponent} from '../components/json-replace/json-replace.component';
import {DashBoardRoutingModule} from '../routing/dash-board-routing.module';
import {SharedModule} from './shared.module';
import {FileService} from '../services/file.service';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    DashBoardComponent,
    SquareComponent,
    JsonReplaceComponent,
  ],
  imports: [
    DashBoardRoutingModule,
    SharedModule,

  ],
  providers: [FileService],
})
export class DashboardModule { }
