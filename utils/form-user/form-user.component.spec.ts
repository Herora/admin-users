import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserComponent } from './form-user.component';
import { ApiService } from 'src/app/core/https/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CircleComponent } from '../circle/circle.component';
import { UploadTakePhotoComponent } from '../upload-take-photo/upload-take-photo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormUserComponent', () => {
  let component: FormUserComponent;
  let fixture: ComponentFixture<FormUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormUserComponent,
        CircleComponent,
        UploadTakePhotoComponent
      ],
      imports: [
        HttpClientTestingModule,
        SharedsModule,
        MatMenuModule,
        MatSelectModule,
        MatDialogModule,
        ReactiveFormsModule,
      ],
      providers: [
        ApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create valid responsive', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(570);
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      expect(component.responsive()).toEqual('view-display1');
  });

  it('should create valid responsive', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(570);
      window.dispatchEvent(new Event('resize'));
      component.back = true;
      fixture.detectChanges();
      expect(component.responsive()).toEqual('view-display2');
  });

  it('should show concatenated username', () => {
    component.user.patchValue({
      names: 'test test',
      surnames: 'test test'
    });
    component.createUserName();
    expect(component.userName).toEqual('tttestt');
  });

  it('should show concatenated username without two name and without two surnames', () => {
    component.user.patchValue({
      names: 'test',
      surnames: 'test'
    });
    component.createUserName();
    expect(component.userName).toEqual('ttest');
  });

  xit('should valid percentage with half the required fields at 50%', () => {
    component.userForm = undefined;
    component.ngOnInit();
    component.user.patchValue({
      identificationTypeId: 1,
      identificationNumber: 1234567890,
      names: 'test',
      surnames: 'test',
      phone: '',
      email: 'asd'
    });
    expect(component.porcentage).toEqual(50);
  });

  it('should valid percentage with half the required fields at 100%', () => {
    component.user.patchValue({
      identificationTypeId: 1,
      identificationNumber: 1234567890,
      names: 'test',
      surnames: 'test',
      email: 'test@test.com',
      phone: 4040625,
      rolesList: [1, 2]
    });
    expect(component.porcentage).toEqual(100);
  });

  it('should reset form', () => {
    component.user.patchValue({
      names: 'test',
      surnames: 'test'
    });
    component['onResetForm']();
    expect(component.user.get('names').value).toEqual('');
  });
});
