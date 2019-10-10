import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {JsonReplaceComponent} from '../pages/json-replace/json-replace.component';
import {FileService} from '../services/file.service';
import {MatIconModule, MatTreeModule} from '@angular/material';

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
    MatIconModule
  ],
  providers: [FileService],
})
export class SharedModule { }
