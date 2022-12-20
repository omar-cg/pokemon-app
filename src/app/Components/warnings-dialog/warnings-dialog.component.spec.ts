import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningsDialogComponent } from './warnings-dialog.component';

describe('WarningsDialogComponent', () => {
  let component: WarningsDialogComponent;
  let fixture: ComponentFixture<WarningsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
