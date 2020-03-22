export class FileApiService {
  private static fileApiService: FileApiService;
  constructor() {}
  public static getInstance() {
    if (!this.fileApiService) {
      this.fileApiService = new FileApiService();
    }
    return this.fileApiService;
  }

  public readFile(data) {
    console.log('Class: FileApiService, Line 13 : ', data);
  }
}
