import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsListComponent } from './tutorials-list.component';

describe('TutorialsList', () => {
  let component: TutorialsListComponent;
  let fixture: ComponentFixture<TutorialsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
