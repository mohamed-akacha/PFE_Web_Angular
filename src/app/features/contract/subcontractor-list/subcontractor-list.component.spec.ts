import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractorListComponent } from './subcontractor-list.component';

describe('SubcontractorListComponent', () => {
  let component: SubcontractorListComponent;
  let fixture: ComponentFixture<SubcontractorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubcontractorListComponent]
    });
    fixture = TestBed.createComponent(SubcontractorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
