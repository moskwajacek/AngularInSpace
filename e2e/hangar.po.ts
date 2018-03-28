

import { element, by, browser } from 'protractor';

export class HangarPage {
  nagivateTo() {
    browser.get('/hangar');
  }

  setShipQuantity(number: number) {
    const input = element(by.name('shipCount'));
    input.clear().then(() => input.sendKeys(number));
  }

  setFighterType() {
    element.all(by.css(`[name="shipType"]`)).first().click();
  }

  submitProduceForm() {
    element(by.buttonText('Produkuj')).click();
  }

  getShipsCount() {
    const shipCount = element.all(by.css('app-space-ship')).count();
    return shipCount;
  }
}