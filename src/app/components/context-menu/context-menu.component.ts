import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'json-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  public left: number;
  @Input() top: number;

  @Output() addNodeEmitter = new EventEmitter<any>();
  @Output() renameNodeEmitter = new EventEmitter<any>();
  @Output() removeNodeEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.left = 185;
    this.top -= 62;
  }

  removeNode() {
    this.removeNodeEmitter.next();
  }

  renameNode() {
    this.renameNodeEmitter.next();
  }

  addNode() {
    this.addNodeEmitter.next();
  }
}
