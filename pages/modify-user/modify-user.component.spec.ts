import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyUserComponent } from './modify-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { ApiService } from 'src/app/core/https/http.service';
import { CircleComponent } from '../../utils/circle/circle.component';
import { UploadTakePhotoComponent } from '../../utils/upload-take-photo/upload-take-photo.component';
import { StoreModule } from '@ngrx/store';

describe('ModifyUserComponent', () => {
  let component: ModifyUserComponent;
  let fixture: ComponentFixture<ModifyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModifyUserComponent,
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
    fixture = TestBed.createComponent(ModifyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
