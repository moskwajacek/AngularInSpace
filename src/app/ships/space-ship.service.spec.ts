import { TestBed, inject } from '@angular/core/testing';

import { SpaceShipService } from './space-ship.service';

describe('SpaceShipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpaceShipService]
    });
  });

  it('should ...', inject([SpaceShipService], (service: SpaceShipService) => {
    expect(service).toBeTruthy();
  }));
});