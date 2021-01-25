import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
/* import { CamComponent } from './utils/cam/cam.component'; */
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
/* import { UploadTakePhotoComponent } from './utils/upload-take-photo/upload-take-photo.component';
import { DialogComponent } from './utils/dialog/dialog.component'; */
/* import { CanvasPhotoComponent } from './utils/canvas-photo/canvas-photo.component'; */
import { ApiService } from 'src/app/core/https/http.service';
import { MatSelectModule } from '@angular/material/select';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { ModifyUserComponent } from './pages/modify-user/modify-user.component';
import { FormUserComponent } from './utils/form-user/form-user.component';
import { CircleComponent } from './utils/circle/circle.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CreateComponent } from './pages/create/create.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ConsultUserComponent } from './pages/consult-user/consult-user.component';
import { CanDeactivateGuard } from 'src/app/shareds/form-validate/can-deactivate.guard';


@NgModule({
  declarations: [
    CreateComponent,
/*     CamComponent, */
/*     DialogComponent, */
/*     UploadTakePhotoComponent, */
/*     CanvasPhotoComponent, */
    ModifyUserComponent,
    FormUserComponent,
    CircleComponent,
    AdminComponent,
    ConsultUserComponent,
    ConsultUserComponent
  ],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    SharedsModule,
  ],
  exports: [
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule
  ],
  providers: [
    ApiService,
    CanDeactivateGuard
  ]

})
export class ManageUsersModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('testlitle');
  }
}
