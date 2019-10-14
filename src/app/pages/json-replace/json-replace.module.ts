import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {JsonReplaceRoutingModule} from './json-replace-routing.module';
import {JsonReplaceComponent} from './json-replace.component';

@NgModule({
  declarations: [
    JsonReplaceComponent
  ],
  imports: [
    CommonModule,
    JsonReplaceRoutingModule,
    SharedModule
  ],
})
export class JsonReplaceModule { }
