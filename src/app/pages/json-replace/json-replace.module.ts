import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JsonReplaceComponent} from './json-replace.component';
import {SharedModule} from '../../shared/shared.module';
import {JsonReplaceRoutingModule} from './json-replace-routing.module';
import {FileService} from '../../services/file.service';

@NgModule({
  declarations: [
    JsonReplaceComponent
  ],
  imports: [
    CommonModule,
    JsonReplaceRoutingModule,
    SharedModule
  ],
  providers: [FileService],
})
export class JsonReplaceModule { }
