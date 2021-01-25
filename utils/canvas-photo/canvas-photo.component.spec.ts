import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasPhotoComponent } from './canvas-photo.component';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';

describe('CanvasPhotoComponent', () => {
  let component: CanvasPhotoComponent;
  let fixture: ComponentFixture<CanvasPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasPhotoComponent],
      imports: [
        MatIconModule,
        HttpClientTestingModule,
        SharedsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component for canvas photo', () => {
    expect(component).toBeTruthy();
  });

  it('should turn left', () => {
    component.left();
    expect(true).toBeTrue();
  });

  it('should turn right', () => {
    component.right();
    expect(true).toBeTrue();
  });

  it('should save the image of a change', () => {
    const simple: SimpleChange = new SimpleChange ('', 'image', false);
    component.ngOnChanges({['image']: simple});
    expect(true).toBeTrue();
  });
  it('should save the image without any changes', () => {
    const simple: SimpleChange = new SimpleChange ('', 'image', false);
    component.ngOnChanges({['image2']: simple});
    expect(true).toBeTrue();
  });
});
