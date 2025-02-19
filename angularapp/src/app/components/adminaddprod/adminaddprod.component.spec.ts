import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminaddprodComponent } from './adminaddprod.component';

describe('AdminaddprodComponent', () => {
  let component: AdminaddprodComponent;
  let fixture: ComponentFixture<AdminaddprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminaddprodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminaddprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
