import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JsonTreeRoutingModule} from './json-tree-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {JsonTreeComponent} from './json-tree.component';
import {AddKeyDialogComponent} from '../../components/add-key-dialog/add-key-dialog.component';

@NgModule({
  declarations: [
    JsonTreeComponent,
    AddKeyDialogComponent
  ],
  imports: [
    CommonModule,
    JsonTreeRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddKeyDialogComponent
  ],
})
export class JsonTreeModule { }
