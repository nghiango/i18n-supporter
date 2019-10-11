import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';


interface JsonNode {
  name: string;
  children?: JsonNode[];
  path?: string;
}
const TREE_DATA: JsonNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussel sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];
@Component({
  selector: 'json-json-tree',
  templateUrl: './json-tree.component.html',
  styleUrls: ['./json-tree.component.scss']
})
export class JsonTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<JsonNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<JsonNode>();
  temp_data = {
    'components': {
      'duplicateOverlay': {
        'gender': 'Sesso',
      },
      'test': {
        'name': 'ha ha',
        'child': {
          'name': 'hu hu'
        }
      }
    }
  };
  constructor() {
  }

  ngOnInit() {
    const treeData: JsonNode[] = [];
    this.buildTreeData(this.temp_data, treeData);
    this.dataSource.data = treeData;
  }
  hasChild = (_: number, node: JsonNode) => !!node.children && node.children.length > 0;

  private buildTreeData(resource: Object, treeData: JsonNode[]) {
    const keys = Object.keys(resource);
    if (keys.length > 0) {
      keys.forEach(key => {
        if (Object.keys(resource[key]).length > 0) {
          treeData.push({name: key, children: []});
        }
      });
    }
    return treeData;
  }
}
