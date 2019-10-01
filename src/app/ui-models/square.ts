

export class Square {
  title: string;
  description: string;
  iconPath: string;
  backgroundColor: string;
  pathNavigate: string;

  constructor(title: string, description: string, iconPath: string,
              backgroundColor: string, pathNavigate: string) {
    this.title = title;
    this.description = description;
    this.iconPath = iconPath;
    this.backgroundColor = backgroundColor;
    this.pathNavigate = pathNavigate;
  }
}
