import {environment} from '../../../environments/environment';
import {ArrayDataSource} from '@angular/cdk/collections';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {flatten, unflatten} from 'flat';
import {Subscription} from 'rxjs';
import {isNullOrUndefined} from 'src/app/services/util';
import {insert} from 'src/app/shared/arrays';

import {AddKeyDialogComponent} from '../../components/add-key-dialog/add-key-dialog.component';
import {FileDto} from '../../models/file-dto';
import {JsonFlat} from '../../models/json-flat';
import {FileService} from '../../services/file.service';
import {JsonService} from '../../services/json.service';
import {currentPath, fileOptions} from '../../shared/global-variable';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

type SearchBy = 'key' | 'value';
@Component({
  selector: 'json-json-tree',
  templateUrl: './json-tree.component.html',
  styleUrls: ['./json-tree.component.scss']
})
export class JsonTreeComponent implements OnInit {
  public currentNode: JsonFlat;
  public files: FileDto[] = [];
  public dataSource: ArrayDataSource<JsonFlat>;
  public nodeHeader = '';
  public isReviewMode: boolean;
  private currentJsonDictionary: Object;
  private searchedJsonDic: Object;
  private currentNestedJson: Object;
  private currentJsonFlats: JsonFlat[];
  private searchedJsonFlats: JsonFlat[];
  private editingKey = '';
  public filterControl = new FormControl();
  public searchOptionControl = new FormControl('value');
  private isDev = environment.isDev;
  public searchPlaceholder = 'Search by value';
  private searchBy: SearchBy = 'value';
  private toTest = {
    'components': {
      'duplicateOverlay': {
        'gender': 'Gender',
        'name': 'Nghia',
        'what': 'in component'
      }
    },
    'profile': {
      'person': {
        'name': 'Nghia',
        'what': 'in profile'
      }
    }
  };

  private contextMenuX: number;
  private contextMenuY: number;
  public contextMenu: boolean;

  private subscription = new Subscription();
  private currentSearchKeyData: string[];
  private currentSearchValueData: Map<string, string[]>;

  constructor(
    public jsonService: JsonService,
    public fileService: FileService,
    public dialog: MatDialog,
  ) {} 

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    currentPath.next('json-tree');
    this.subscription.add(this.filterControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => this.filterNode(value, this.searchBy)));
    this.subscription.add(this.searchOptionControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(value => this.searchBy = value));
    if (this.isDev) {
      const jsonDictionary = flatten(this.toTest);
      const fileDto = new FileDto('test', 'test', jsonDictionary, new FormControl());
      this.files.push(fileDto);
      this.initJsonTree(this.toTest, Object.assign({}, jsonDictionary));
      this.updateJsonTreeData(this.currentJsonFlats);
      this.prepareDataForSearching();
    }
  }

  private filterNode(value: string, searchBy: SearchBy = 'value'): void {
    this.searchedJsonDic = {};
    this.searchedJsonFlats = null;
    if (this.currentSearchValueData && searchBy === 'value') {
      const keys = this.currentSearchValueData[value];
      if (keys && keys.length > 0) {
        keys.forEach(key => this.searchedJsonDic[key] = this.currentJsonDictionary[key]);
        this.searchedJsonFlats = this.jsonService.buildJsonFlats(unflatten(this.searchedJsonDic), '', 1, [], true);
      }
    }

    if (this.searchedJsonFlats && this.searchedJsonFlats.length > 0) {
      this.updateJsonTreeData(this.searchedJsonFlats);
    } else {
      this.updateJsonTreeData(this.currentJsonFlats);
    }
  }

  private toggleNode(node: JsonFlat) {
    node.isExpanded = !node.isExpanded;
    if (node.hasChildren && !node.isExpanded) {
      const childNodes = this.getChildNodes(node);
      for (let i = 0; i < childNodes.length; i++) {
        childNodes[i].isExpanded = node.isExpanded;
      }
    }
  }

  private updateValueFormControl(files: FileDto[], path: string) {
    files.forEach(file => {
      file.formControl.setValue(file.jsonDictionary[path]);
      if (!(path in file.jsonDictionary)) {
        file.notExisted = true;
        file.formControl.disable();
      } else {
        file.notExisted = false;
        file.formControl.enable();
      }
    });
  }

  updateValueForDictionary(file: FileDto) {
    // TODO: Should use valueChanges and deboundedTime to reduce update
    file.jsonDictionary[this.currentNode.path] = file.formControl.value;
  }

  handleFileInput($event) {
    const fileImports: File[] = Array.from($event.target.files);
    let count = 0;
    fileImports.forEach(file => {
      this.fileService.readFile(file.path).then(content => {
        const jsonObject = this.jsonService.parseToJson(content);
        const jsonDictionary = flatten(jsonObject);

        const fileDto = new FileDto(file.path, file.name, jsonDictionary, new FormControl());
        this.files.push(fileDto);
        this.initJsonTree(jsonObject, Object.assign({}, jsonDictionary));
        count++;
        if (count === fileImports.length) {
          this.updateJsonTreeData(this.currentJsonFlats);
        }
      });
    });
    this.prepareDataForSearching();
  }

  private initJsonTree(jsonObject, jsonDictionary) {
    if (isNullOrUndefined(this.currentNestedJson)) {
      this.currentNestedJson = jsonObject;
      this.currentJsonDictionary = jsonDictionary;
    } else {
      this.currentJsonDictionary = this.jsonService.mergeKeys(this.currentJsonDictionary, jsonDictionary);
      this.currentNestedJson = unflatten(this.currentJsonDictionary);
    }
    this.currentJsonFlats = this.jsonService.buildJsonFlats(this.currentNestedJson, '', 1, []);
  }

  private updateJsonTreeData(jsonFlats: JsonFlat[]) {
    this.dataSource = new ArrayDataSource(jsonFlats);
  }

  addKeyInFile(file: FileDto) {
    file.jsonDictionary[this.currentNode.path] = '';
    file.notExisted = false;
    file.formControl.enable();
  }

  removeKeyInFile(file: FileDto) {
    delete file.jsonDictionary[this.currentNode.path];
    file.notExisted = true;
    file.formControl.disable();
    file.formControl.setValue('');
  }

  removeKey() {
    this.files.forEach(file => {
      this.removeKeyInFile(file);
    });
    this.currentJsonFlats = this.removeNode(this.currentNode, this.currentJsonFlats);
    this.updateJsonTreeData(this.currentJsonFlats);
    this.currentNode = null;
    this.nodeHeader = '';
  }

  private removeNode = (node: JsonFlat, jsonFlats: JsonFlat[]): JsonFlat[] => {
    for (let i = 0; i < jsonFlats.length; i++) {
      if (jsonFlats[i].path === node.path) {
        jsonFlats.splice(i, 1);
        break;
      }
    }
    return jsonFlats;
  }

  addKey() {
    this.dialog.open(AddKeyDialogComponent, {
      data: {
        files: this.files,
        node: this.currentNode
      }
    }).afterClosed().subscribe(value => {
      if (!value) {
        return;
      }
      let parentIndex = this.currentJsonFlats.indexOf(this.currentNode);
      insert(this.currentJsonFlats, ++parentIndex, value);
      this.updateJsonTreeData(this.currentJsonFlats);
    });
  }

  enterEditMode() {
    this.editingKey = Date.now().toString();
    this.currentNode.editingKey = this.editingKey;
  }

  exitEditMode(node: JsonFlat) {
    this.editingKey = '';
    node.formControl.setValue(node.name);
  }

  updateKeyName(node: JsonFlat) {
    if (this.isNewKeyExistedInThisLevel(node) || node.formControl.invalid) {
      this.exitEditMode(node);
      alert('Your key is duplicated or blank, please change it!');
    } else {
      this.editingKey = '';
      node.name = node.formControl.value;
      const oldPath = node.path;
      const newPath = node.path = this.jsonService.getCombinePath(node.name, node.path);
      this.updateParentPathOfChildren(node);
      this.updatePathOfDictionary(oldPath, newPath);
    }
  }

  private isNewKeyExistedInThisLevel(node: JsonFlat) {
    const parentNode = this.getParentNode(node);
    if (parentNode) {
      const childrenNodes = this.getChildNodes(parentNode);
      for (let i = 0; i < childrenNodes.length; i++) {
        if ((isNullOrUndefined(childrenNodes[i].editingKey) || childrenNodes[i].editingKey === '')
          && childrenNodes[i].name === node.formControl.value) {
          return true;
        }
      }
    }
    return false;
  }

  reviewFiles() {
    this.isReviewMode = true;
    this.files.forEach(file => file.nestedJsonContent = this.jsonService.buildJson(file.jsonDictionary));
  }

  private updateParentPathOfChildren(parentNode: JsonFlat) {
    const childNodes = this.getChildNodes(parentNode);
    if (childNodes) {
      // TODO: Should think again of update parent Path
      // childNodes.forEach(node => node.parentPath = parentNode.path);
    }
  }

  private updatePathOfDictionary(oldPath: string, newPath: string) {
    this.files.forEach(file => {
      file.jsonDictionary[newPath] = file.jsonDictionary[oldPath];
      delete file.jsonDictionary[oldPath];
    });
  }

  clearAll() {
    this.currentJsonFlats = null;
    this.currentJsonDictionary = null;
    this.currentNestedJson = null;
    this.currentNode = null;
    this.files = [];
    this.updateJsonTreeData(this.currentJsonFlats);
  }

  saveFile() {
    if (fileOptions.flatJson) {
      this.files.forEach(file => {
        const flattenJson = this.jsonService.buildFlattenJsonString(file.jsonDictionary, fileOptions);
        this.fileService.saveFile({path: file.path, content: flattenJson});
      });
      return;
    }
    this.files.forEach(file => {
      file.nestedJsonContent = this.jsonService.buildJson(file.jsonDictionary);
      this.fileService.saveFile({path: file.path, content: this.jsonService.formatJsonString(file.nestedJsonContent, fileOptions)});
    });
  }

  openNodeFlat(node: JsonFlat) {
    this.toggleNode(node);
    if (!node.hasChildren) {
      if (this.currentNode) {
        this.currentNode.selected = false;
      }
      this.currentNode = node;
      this.nodeHeader = this.currentNode.name;
      node.selected = true;
      this.isReviewMode = false;
      this.updateValueFormControl(this.files, node.path);
    }
  }

  onRightClick(event: MouseEvent, node: JsonFlat) {
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenu = !this.contextMenu;
    this.currentNode = node;
  }

  disableContextMenu() {
    this.contextMenu = false;
  }

  public shouldRender(node: JsonFlat): boolean {
    const parent = this.getParentNode(node);
    return !parent || parent.isExpanded;
  }

  private getParentNode(node: JsonFlat): JsonFlat {
    const jsonFlats = this.searchedJsonFlats ? this.searchedJsonFlats : this.currentJsonFlats;
    const nodeIndex = jsonFlats.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (jsonFlats[i].level === node.level - 1) {
        return jsonFlats[i];
      }
    }
    return null;
  }

  private getChildNodes(node: JsonFlat): JsonFlat[] {
    const children = [];
    const nodeIndex = this.currentJsonFlats.indexOf(node);
    for (let i = nodeIndex + 1; i < this.currentJsonFlats.length; i++) {
      if (this.currentJsonFlats[i].parentPath.startsWith(node.path)) {
        children.push(this.currentJsonFlats[i]);
      } else {
        break;
      }
    }
    return children;
  }

  private prepareDataForSearching() {
    const { dataForSearchValue, dataForSearchKey } = this.jsonService.prepareDataForSearching(this.currentJsonDictionary);
    this.currentSearchKeyData = dataForSearchKey;
    this.currentSearchValueData = dataForSearchValue;
  }
}
