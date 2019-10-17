import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('json-root h1')).getText();
  }

  getSquare() {
    return element.all(by.tagName('json-square'));
  }
}
