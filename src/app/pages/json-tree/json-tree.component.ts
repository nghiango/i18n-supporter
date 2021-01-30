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
  private rightClickNode: JsonFlat;
  public files: FileDto[] = [];
  public dataSource: ArrayDataSource<JsonFlat>;
  public nodeHeader = '';
  public isReviewMode: boolean;
  private currentJsonDictionary: Object;
  private searchedJsonDic: Object;
  private currentNestedJson: Object;
  private currentJsonFlats: JsonFlat[];
  private searchedJsonFlats: JsonFlat[];
  public editingKey = '';
  public filterControl = new FormControl();
  public searchOptionControl = new FormControl('value');
  private isDev = environment.isDev;
  public searchBy: SearchBy = 'value';
  private toTest = {
    'components': {
      'duplicateOverlay': {
        'gender': 'Gender',
        'name': 'Nghia',
        'what': 'in component',
        'deep': {
          'deep1': {
            'deep2': 'ok'
          }
        }
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
  private currentSearchValueData: Map<string, string[]>;
  private currentSearchKeyData: Map<string, string[]>;
  private currentSearchString: string;

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
    ).subscribe(value => {
      this.currentSearchString = value;
      this.filterNode(this.currentSearchString , this.searchBy);
    }));
    this.subscription.add(this.searchOptionControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(searchBy => {
      this.searchBy = searchBy;
      this.filterNode(this.currentSearchString , this.searchBy);
    }));
    if (this.isDev) {
      const jsonDictionary = flatten(this.toTest);
      const fileDto = new FileDto('test', 'test', jsonDictionary, new FormControl());
      this.files.push(fileDto);
      this.initJsonTree(this.toTest, Object.assign({}, jsonDictionary));
      this.updateJsonTreeData(this.currentJsonFlats);
      this.prepareDataKeyForSearching(jsonDictionary);
    }
  }

  private filterNode(input: string, searchBy: SearchBy = 'value'): void {
    this.searchedJsonDic = {};
    this.searchedJsonFlats = null;
    if (this.currentSearchValueData && searchBy === 'value') {
      const keys = this.currentSearchValueData[input];
      if (keys && keys.length > 0) {
        keys.forEach(key => this.searchedJsonDic[key] = this.currentJsonDictionary[key]);
        this.searchedJsonFlats = this.jsonService.buildJsonFlats(unflatten(this.searchedJsonDic), '', null, 1, [], true);
      }
    }
    if (searchBy === 'key') {
      const value = this.currentJsonDictionary[input];
      const keys = this.currentSearchKeyData[input];
      if (value) {
        this.searchedJsonDic[input] = value;
        this.searchedJsonFlats = this.jsonService.buildJsonFlats(unflatten(this.searchedJsonDic), '', null, 1, [], true);
      } else if (keys) {
        if (keys && keys.length > 0) {
          keys.forEach(key => this.searchedJsonDic[key] = this.currentJsonDictionary[key]);
          this.searchedJsonFlats = this.jsonService.buildJsonFlats(unflatten(this.searchedJsonDic), '', null, 1, [], true);
        }
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
        this.prepareDataValueForSearching(jsonDictionary);
        if (count === fileImports.length) {
          this.updateJsonTreeData(this.currentJsonFlats);
          this.prepareDataKeyForSearching(this.currentJsonDictionary);
        }
      });
    });
  }

  private initJsonTree(jsonObject, jsonDictionary) {
    if (isNullOrUndefined(this.currentNestedJson)) {
      this.currentNestedJson = jsonObject;
      this.currentJsonDictionary = jsonDictionary;
    } else {
      this.currentJsonDictionary = this.jsonService.mergeKeys(this.currentJsonDictionary, jsonDictionary);
      this.currentNestedJson = unflatten(this.currentJsonDictionary);
    }
    this.currentJsonFlats = this.jsonService.buildJsonFlats(this.currentNestedJson, '', null, 1, []);
  }

  private updateJsonTreeData(jsonFlats: JsonFlat[]) {
    this.dataSource = new ArrayDataSource(jsonFlats);
  }

  addKeyInFile(file: FileDto) {
    file.jsonDictionary[this.currentNode.path] = '';
    file.notExisted = false;
    file.formControl.enable();
  }

  removeKeyInFile(file: FileDto, path: string) {
    delete file.jsonDictionary[path];
    file.notExisted = true;
    file.formControl.disable();
    file.formControl.setValue('');
  }

  // TODO: Check case remove a child of one-child parent
  removeKey() {
    if (this.rightClickNode.hasChildren) {
      this.removeChildKeys(this.rightClickNode);
    } else {
      const parent = this.rightClickNode.parentNode;
      const children = this.getChildNodes(parent);
      if (children.length === 1) {
        parent.hasChildren = false;
      }
    }
    this.files.forEach(file => {
      this.removeKeyInFile(file, this.rightClickNode.path);
    });
    this.currentJsonFlats = this.removeNode(this.rightClickNode.path, this.currentJsonFlats);
    this.updateJsonTreeData(this.currentJsonFlats);
    this.rightClickNode = null;
    this.nodeHeader = '';
  }

  private removeNode = (path: string, jsonFlats: JsonFlat[]): JsonFlat[] => {
    for (let i = 0; i < jsonFlats.length; i++) {
      if (jsonFlats[i].path === path) {
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
    if (this.currentNode) {
      this.currentNode.editingKey = null;
    }
    this.openNodeFlat(this.rightClickNode, false);
    this.currentNode.formControl.setValue(this.currentNode.name);
    this.editingKey = Date.now().toString();
    this.currentNode.editingKey = this.editingKey;
  }

  exitEditMode(node: JsonFlat, event = null) {
    if (event) {
      event.stopPropagation();
    }
    this.editingKey = '';
    node.editingKey = null;
    node.formControl.setValue(node.name);
    this.currentJsonDictionary[node.path] = node.name;
  }

  updateKeyName(node: JsonFlat, event = null) {
    if (event) {
      event.stopPropagation();
    }
    if (this.isNewKeyExistedInThisLevel(node) || node.formControl.invalid) {
      this.exitEditMode(node);
      alert('Your key is duplicated or blank, please change it!');
    } else {
      this.editingKey = '';
      if (node.name === node.formControl.value) {
        return;
      }
      node.name = node.formControl.value;
      const oldPath = node.path;
      const newPath = node.path = this.jsonService.getCombinePath(node.name, node.path);
      this.updateParentPathForChildren(node, oldPath);
      this.updatePathOfDictionary(oldPath, newPath);
      this.openNodeFlat(this.currentNode, false);
    }
  }

  private isNewKeyExistedInThisLevel(node: JsonFlat) {
    const parentNode = node.parentNode;
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

  private updateParentPathForChildren(parentNode: JsonFlat, oldPath: string) {
    const childNodes = this.getChildNodes(parentNode);
    if (childNodes) {
      childNodes.forEach(node => {
        const nodeChildOldPath = node.path;
        node.path = node.path.replace(oldPath, parentNode.path);
        this.updatePathOfDictionary(nodeChildOldPath, node.path);
        if (node.hasChildren) {
          this.updateParentPathForChildren(node, nodeChildOldPath);
        }
      });
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

  private isOthersInEditMode(node: JsonFlat): boolean {
    let isClose = true;
    // Don't close if don't have a right click node
    if (!this.rightClickNode) {
      return false;
    }
    // Don't close if rightClickNode name equals the node want to open
    if (this.rightClickNode.name === node.name) {
      isClose = false;
    }

    if (!this.currentNode) {
      return false;
    }
    // Close if right click on node, then left click to choose the node
    if (this.currentNode && this.currentNode.name !== this.rightClickNode.name) {
      isClose = true;
    }
    return isClose;
  }

  public openNodeFlat(node: JsonFlat, isToggleNode: boolean = true): void {
    if (this.isOthersInEditMode(node)) {
      this.exitEditMode(this.currentNode);
    }
    if ( node.editingKey !== this.editingKey && isToggleNode) {
      this.toggleNode(node);
    }

    this.setCurrentNode(node);
    node.selected = true;
    this.isReviewMode = false;

    if (!node.hasChildren) {
      this.nodeHeader = this.currentNode.name;
      this.updateValueFormControl(this.files, node.path);
    }
  }

  private setCurrentNode(node: JsonFlat) {
  if (this.currentNode) {
    this.currentNode.selected = false;
  }
    this.currentNode = node;
  }

  onRightClick(event: MouseEvent, node: JsonFlat) {
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenu = !this.contextMenu;
    this.rightClickNode = node;
  }

  disableContextMenu() {
    this.contextMenu = false;
  }

  public shouldRender(node: JsonFlat): boolean {
    const parent = node.parentNode;
    return !parent || parent.isExpanded;
  }

  private getChildNodes(parentNode: JsonFlat): JsonFlat[] {
    const children = [];
    const parentNodeIndex = this.currentJsonFlats.indexOf(parentNode);
    for (let i = parentNodeIndex + 1; i < this.currentJsonFlats.length; i++) {
      const node = this.currentJsonFlats[i];
      if (node.parentNode === parentNode) {
        children.push(this.currentJsonFlats[i]);
      } else if (node.level === parentNode.level) {
        break;
      }
    }
    return children;
  }

  private prepareDataKeyForSearching(jsonDic: Object) {
    this.currentSearchKeyData  = this.jsonService.prepareDataForSearching(this.currentSearchKeyData, jsonDic, 'key');
  }

  private prepareDataValueForSearching(jsonDic: Object) {
    this.currentSearchValueData  = this.jsonService.prepareDataForSearching(this.currentSearchValueData, jsonDic);
  }

  private removeChildKeys(parentNode: JsonFlat) {
    const children = this.getChildNodes(parentNode);
    children.forEach(node => {
      this.files.forEach(file => {
        this.removeKeyInFile(file, node.path);
      });
      this.currentJsonFlats = this.removeNode(node.path, this.currentJsonFlats);
    });
  }
}
