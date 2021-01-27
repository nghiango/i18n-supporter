import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatTooltipModule } from '@angular/material/tooltip'
import { CommonModule } from '@angular/common'
import { FileService } from '../services/file.service'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTreeModule } from '@angular/material/tree'
import { JsonService } from '../services/json.service'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTreeModule,
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
    ScrollingModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  providers: [FileService, JsonService],
})
export class SharedModule {}
