import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteiaListComponent } from './criteia-list.component';

describe('CriteiaListComponent', () => {
  let component: CriteiaListComponent;
  let fixture: ComponentFixture<CriteiaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteiaListComponent]
    });
    fixture = TestBed.createComponent(CriteiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
