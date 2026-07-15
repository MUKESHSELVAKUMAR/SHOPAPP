import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginhomeComponent } from './loginhome.component';

describe('LoginhomeComponent', () => {
  let component: LoginhomeComponent;
  let fixture: ComponentFixture<LoginhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginhomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
