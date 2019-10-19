export class JsonNode {
  name: string;
  children?: JsonNode[];
  path?: string;
  selected?: boolean;
  parent?: JsonNode;
}
