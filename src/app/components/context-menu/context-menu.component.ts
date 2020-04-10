import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'json-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  public left: number;
  @Input() top: number;

  constructor() { }

  ngOnInit() {
    this.left = 185;
    this.top -= 62;
  }

}
