import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashBoardComponent} from '../pages/dash-board/dash-board.component';
import {SquareComponent} from '../components/square/square.component';
import {JsonReplaceComponent} from '../components/json-replace/json-replace.component';
import {DashBoardRoutingModule} from '../routing/dash-board-routing.module';
import {MatButtonModule, MatInputModule} from '@angular/material';
import {SharedModule} from './shared.module';
import {FileService} from '../services/file.service';

@NgModule({
  declarations: [
    DashBoardComponent,
    SquareComponent,
    JsonReplaceComponent,
  ],
  imports: [
    CommonModule,
    DashBoardRoutingModule,
    MatButtonModule,
    MatInputModule,
  ],
  providers: [FileService],
})
export class DashboardModule { }
