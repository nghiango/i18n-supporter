import {getTestBed, TestBed} from '@angular/core/testing';

import { JsonService } from './json.service';

describe('JsonService', () => {
  let injector: TestBed;
  let service: JsonService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonService],
    });

    injector = getTestBed();
    service = injector.get(JsonService);
  });

  it('should be true path after combinePath', () => {
    const mockData = [
      {name: 'anotherName', path: 'root.combine.name', result: 'root.combine.anotherName'},
      {name: 'anotherName', path: 'root.combine.name.', result: 'root.combine.anotherName.'}
    ];
    mockData.forEach(testCase => {
      expect(service.getCombinePath(testCase.name, testCase.path)).toEqual(testCase.result);
    });

  });
});
