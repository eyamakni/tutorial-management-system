import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantDashboardComponent } from './etudiant-dashboard.component';

describe('EtudiantDashboard', () => {
  let component: EtudiantDashboardComponent;
  let fixture: ComponentFixture<EtudiantDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
