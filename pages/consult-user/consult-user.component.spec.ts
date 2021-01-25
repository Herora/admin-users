import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultUserComponent } from './consult-user.component';
import { UploadTakePhotoComponent } from '../../utils/upload-take-photo/upload-take-photo.component';
import { CircleComponent } from '../../utils/circle/circle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { ApiService } from 'src/app/core/https/http.service';
import { StoreModule } from '@ngrx/store';

describe('ConsultUserComponent', () => {
  let component: ConsultUserComponent;
  let fixture: ComponentFixture<ConsultUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConsultUserComponent,
        UploadTakePhotoComponent,
        CircleComponent
      ],
      imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        ApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
