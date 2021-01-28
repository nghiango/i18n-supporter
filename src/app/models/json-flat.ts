import { FormControl } from '@angular/forms';

export class JsonFlat {
  name: string;
  path: string;
  parentNode: JsonFlat;
  level: number;
  hasChildren: boolean;
  selected: boolean;
  formControl = new FormControl();
  editingKey?: string;
  isExpanded?: boolean;
}
