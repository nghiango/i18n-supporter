import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JsonTreeRoutingModule} from './json-tree-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {JsonTreeComponent} from './json-tree.component';

@NgModule({
  declarations: [
    JsonTreeComponent,
  ],
  imports: [
    CommonModule,
    JsonTreeRoutingModule,
    SharedModule
  ]
})
export class JsonTreeModule { }
