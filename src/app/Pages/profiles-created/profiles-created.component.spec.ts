import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesCreatedComponent } from './profiles-created.component';

describe('ProfilesCreatedComponent', () => {
  let component: ProfilesCreatedComponent;
  let fixture: ComponentFixture<ProfilesCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilesCreatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
