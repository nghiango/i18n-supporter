import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GlobalVariable {
  constructor() {
  }

  public contextMenu = new Subject<boolean>();
}
