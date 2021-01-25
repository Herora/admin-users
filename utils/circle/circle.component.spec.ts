import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleComponent } from './circle.component';

describe('CircleComponent', () => {
  let component: CircleComponent;
  let fixture: ComponentFixture<CircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleComponent);
    component = fixture.componentInstance;
    component.porcentage = 0;
    fixture.detectChanges();
  });

  it('should create initial component Circle', () => {
    expect(component).toBeTruthy();
  });
  it('should view the text 0 de 2', () => {
    expect(component.textPercentage()).toEqual('0 de 2');
  });
  it('should view the text 1 de 2', () => {
    component.porcentage = 50;
    expect(component.textPercentage()).toEqual('1 de 2');
  });
  it('should view the text 2 de 2', () => {
    component.porcentage = 100;
    expect(component.textPercentage()).toEqual('2 de 2');
  });
});
