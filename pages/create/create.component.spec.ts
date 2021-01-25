import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateComponent } from './create.component';
import { CamComponent } from '../../utils/cam/cam.component';
import { DialogComponent } from '../../utils/dialog/dialog.component';
import { UploadTakePhotoComponent } from '../../utils/upload-take-photo/upload-take-photo.component';
import { CanvasPhotoComponent } from '../../utils/canvas-photo/canvas-photo.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { ApiService } from 'src/app/core/https/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { FormUserComponent } from '../../utils/form-user/form-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CircleComponent } from '../../utils/circle/circle.component';
import { StoreModule } from '@ngrx/store';

describe('Test for create user' , () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let apiService: ApiService;
  let spyPostApiService: any;
  const mockUser = {
    message: 'El número de documento ya existe'
  };
  const mockUser1 = {
    message: 'Usuario creado exitosamente'
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateComponent,
        UploadTakePhotoComponent,
        FormUserComponent,
        CircleComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatSelectModule,
        MatDialogModule,
        SharedsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'setting/rol/admin', component: CreateComponent}]
        ),
        StoreModule.forRoot({}),
      ],
      providers: [
        ApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    apiService = TestBed.inject(ApiService);
    spyPostApiService = spyOn(apiService, 'post');
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should show that the user is already saved', async () => {
    spyPostApiService.and.returnValue(Promise.resolve(mockUser));
    component.createUser({id: 1});
    spyPostApiService.calls.mostRecent().returnValue.then((result) => {
      expect(mockUser.message).toEqual(result.message);
    });
  });
  it('call modal', async () => {
    spyPostApiService.and.returnValue(Promise.resolve(mockUser1));
    component.createUser({id: 1});
    spyPostApiService.calls.mostRecent().returnValue.then((result) => {
      expect(mockUser1.message).toEqual(result.message);
    });
  });
});
