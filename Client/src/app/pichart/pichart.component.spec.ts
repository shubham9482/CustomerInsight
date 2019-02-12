import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PichartComponent } from './pichart.component';

describe('PichartComponent', () => {
  let component: PichartComponent;
  let fixture: ComponentFixture<PichartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PichartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PichartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
