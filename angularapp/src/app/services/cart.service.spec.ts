import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'
import { CartService } from './cart.service';

describe('CartService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CartService]
    }).compileComponents();
  });

  it('should be created', () => {
    const service: CartService = TestBed.inject(CartService);
    expect(service).toBeTruthy();
  });
});