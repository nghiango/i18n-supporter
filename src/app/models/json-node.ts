export class JsonNode {
  name: string;
  children?: JsonNode[];
  path?: string;
  selected?: boolean;
  parentPath?: string;
  editingNumber?: string;
}
