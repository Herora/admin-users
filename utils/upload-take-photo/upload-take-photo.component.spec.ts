import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTakePhotoComponent } from './upload-take-photo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Test for Upload and Take Photo for the user', () => {
  let component: UploadTakePhotoComponent;
  let fixture: ComponentFixture<UploadTakePhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadTakePhotoComponent
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatDialogModule
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTakePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component for Upload and Take Photo for the user', () => {
    expect(component).toBeTruthy();
  });

  it('should return variables to their original state', () => {
    component.imageResult = 'prueba';
    component.deletePhoto();
    expect(component.imageResult).toEqual('');
  });
  it('should behave...', () => {
    component.openDialog('UploadPhoto');
    // document.getElementById("btnSample").click();
  });
});
