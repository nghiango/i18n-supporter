import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';
import {FileService} from '../services/file.service';
import {MatDialogModule, MatExpansionModule, MatIconModule, MatMenuModule, MatSidenavModule, MatTreeModule} from '@angular/material';
import {JsonService} from '../services/json.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTreeModule
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTreeModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    ScrollingModule
  ],
  providers: [FileService, JsonService],
})
export class SharedModule { }
