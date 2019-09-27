import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonReplaceComponent } from './json-replace.component';

describe('JsonReplaceComponent', () => {
  let component: JsonReplaceComponent;
  let fixture: ComponentFixture<JsonReplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonReplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
