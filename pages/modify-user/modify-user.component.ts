import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ApiService } from 'src/app/core/https/http.service';
import { MatOption } from '@angular/material/core';
import { IRole } from 'src/app/core/models/irole';
import { ModalService } from 'src/app/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalNotification } from 'src/app/core/models/modal-notification/modal-notification';
import { User } from 'src/app/core/models/user/user';
import { PuedeDesactivar } from 'src/app/shareds/form-validate/can-deactivate.guard';
import { Subject } from 'rxjs';
import { BreadcrumbcustomService } from '../../../../../../core/services/breadcrumbcustom/breadcrumbcustom.service';
import { RoutingPath } from '../../../../../../../environments/routing-path';


@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})

export class ModifyUserComponent implements OnInit, PuedeDesactivar {

  public header = 'Modificar usuario';
  public buttonName = 'Modificar';
  public user: User;
  public userName = '';
  public image: any;
  public userId: number;
  public imageDefault: any;
  public form: any;
  public subject: Subject<boolean>;
  public dateCreate: any;
  public imageModal: any;
  public saveMensagge: string;
  public successful = false;
  public modal: ModalNotification = {
    idModal: 'modalUpdateUser',
    header: '',
    showFooter: false
  };
  public status = 0;
  public roles: IRole[] = [];
  public selectedrol: any[] = [
    { id: 1, name: 'C.C. Cédula de ciudadanía' },
    { id: 2, name: 'C.E. Cédula de extranjería' },
    { id: 3, name: 'T.I. Tarjeta de identidad' },
    { id: 4, name: 'NIT  Número de identificación tributaria' },
    { id: 5, name: 'R.C. Registro civil' }
  ];

  constructor(private api: ApiService, private _MODAL: ModalService,
              private route: ActivatedRoute, private router: Router,
              private breadcrumbcustomService: BreadcrumbcustomService) {
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.breadcrumbcustomService.setValue('administrator-user', 'id', 'name',
      `@${RoutingPath.appRouting.components.dashboard.pages.administrator_user.alias}`, this.userId);
    this.api.get(`/Users/${this.userId}`).then((result: any) => {
      this.user = result as User;
      this.dateCreate = result.created;
      // this.breadService.paramsName ------------------------------------------------------
    }).catch(() => {
      this.imageDefault = 'assets/images/avatar.png';
    });
  }

  permitirSalirDeRuta(): boolean | import('rxjs').Observable<boolean> | Promise<boolean> {
    if (this.form) {
      const validate = this.form.submitted || !this.form.dirty;
      if (!validate) {
        const subject = new Subject<boolean>();
        this.showValidate('Salir de modificar usuario', '¿Está seguro de que desea salir de la página modificar usuario?', 'warning');
        this.subject = subject;
        return subject.asObservable();
      }
    }
    return true;
  }

  formUser(form) {
    this.form = form;
  }

  updateUser(event: any): void {
    const unit = Object.assign({}, event);
    unit.created = this.dateCreate;

    this.api.put(`/Users/${this.userId}`, unit).then(() => {
      this.showModal('Modificar usuario', 'Usuario actualizado exitosamente.', 'success');
    },
      (resultError) => {
        this.resultSendUser(resultError.error);
      });
  }

  showValidate(header: string, message: string, actionModal: any) {
    this.modal.btnClose = undefined;
    this.modal.header = header;
    this.modal.message = message;
    this.modal.showFooter = true;
    this.modal.buttonsFooter = [
      {
        id: 'btnErrorClose',
        text: 'No',
        class: 'btnCloseError',
        events: [
          {
            name: 'click',
            event: () => {
              this.modal.actionModal = undefined;
              this._MODAL.closeModal('modalUpdateUser');
              this.subject.next(false);
              this.subject.complete();
            }
          }
        ]
      },
      {
        id: 'btnExit',
        text: 'Sí',
        class: 'btnCloseError',
        events: [
          {
            name: 'click',
            event: () => {
              this.modal.actionModal = undefined;
              this._MODAL.closeModal('modalUpdateUser');
              this.subject.next(true);
              this.subject.complete();
            }
          }
        ]
      }
    ];
    this.modal.actionModal = actionModal;
    this.successful = actionModal === 'error';
  }

  showModal(header: string, message: string, actionModal: any) {
    this.modal.btnClose = undefined;
    this.modal.header = header;
    this.modal.message = message;
    this.modal.showFooter = true;
    this.modal.buttonsFooter = [
      {
        id: 'btnErrorClose',
        text: 'Cerrar',
        class: 'btnCloseError',
        events: [
          {
            name: 'click',
            event: () => {
              this.modal.actionModal = undefined;
              this._MODAL.closeModal('modalUpdateUser');
              if (actionModal === 'success') {
                this.router.navigate([`/dashboard/administrator-user/`]);
              }
            }
          }
        ]
      }
    ];
    this.modal.actionModal = actionModal;

    this.successful = actionModal === 'success';
  }

  private resultSendUser(errorMessage: any) {
    let header;
    let message;
    switch (errorMessage.Message) {
      case "IDENTIFICACION_NUMBER_EXIST":
        header = 'Usuario ya existe';
        message = 'El número de documento ya existe.';
        break;
      case "USER_NAME_EXIST":
        header = 'Usuario ya existe';
        message = 'El nombre de usuario ya existe.';
        break;
      case "USER_EMAIL_EXIST":
        header = 'Usuario ya existe';
        message = 'El correo electrónico de usuario ya existe.';
        break;
      case "ROLE_REQUIRED":
        header = 'Rol de usuario requerido';
        message = 'El usuario debe tener al menos un rol.';
        break;
      case "USER_NOT_EXIST":
        header = 'Usuario no existe';
        message = 'El usuario con ese identificador no existe.';
        break;
      default: // 'INTERNAL_SERVER_ERROR'
        header = 'Error al modificar el usuario';
        message = 'El proceso no se terminó satisfactoriamente. Intente nuevamente en unos segundos.';
        break;
    }
    this.showModal(header, message, 'error');
  }
}
