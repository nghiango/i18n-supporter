import { FormControl } from '@angular/forms';

export class JsonFlat {
  name: string;
  path: string;
  parentPath: string;
  level: number;
  hasChildren: boolean;
  selected: boolean;
  formControl = new FormControl();
  editingKey?: string;
  isExpanded?: boolean;
}
