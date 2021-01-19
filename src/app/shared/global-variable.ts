import { BehaviorSubject } from 'rxjs';
import { FileOptions } from './../models/file-options';
import { Builder } from './buider';

export const fileOptions = Builder(FileOptions)
      .doubleQuote(false)
      .flatJson(false)
      .indentWidth(2)
      .tab(true)
      .build();

export const currentPath = new BehaviorSubject('');
