import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeDialogboxComponent } from './alternative-dialogbox.component';

describe('AlternativeDialogboxComponent', () => {
  let component: AlternativeDialogboxComponent;
  let fixture: ComponentFixture<AlternativeDialogboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlternativeDialogboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlternativeDialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
