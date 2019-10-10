import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';


interface JsonNode {
  name: string;
  children?: JsonNode[];
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
        'name': 'Nome Persona',
        'birthdate': 'Data di nascita',
        'address': 'Indirizzo',
        'domicileCountry': 'Paese di origine',
        'status': 'Stato test'
      }
    }
  };
  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    this.buildTreeData(this.temp_data);
  }
  hasChild = (_: number, node: JsonNode) => !!node.children && node.children.length > 0;

  private buildTreeData(temp_data: Object) {
    
  }
}
