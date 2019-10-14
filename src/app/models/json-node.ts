import {JsonFlat} from './json-flat';

export class JsonNode {
  name: string;
  children?: JsonNode[];
  valueDic?: JsonFlat;
  selected?: boolean;
}
