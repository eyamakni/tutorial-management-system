import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantDashboardComponent } from './enseignant-dashboard.component';

describe('EnseignantDashboard', () => {
  let component: EnseignantDashboardComponent;
  let fixture: ComponentFixture<EnseignantDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignantDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnseignantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
