import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AbstractModal } from 'src/app/core/models/abstracts/abstract-modal/abstract-modal';
import { TableItem } from 'src/app/core/models/table-item/table-item';
import { PuedeDesactivar } from 'src/app/shareds/form-validate/can-deactivate.guard';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends AbstractModal implements PuedeDesactivar {

  public header = 'Crear usuario';
  public buttonName = 'Guardar';
  public saveMensagge: string;
  public successful = false;
  private enviado = false;
  public form: any;
  public subject: Subject<boolean>;
  constructor(injector: Injector) {
    super(injector);
  }
  permitirSalirDeRuta() {
    if (this.form) {
      const validate = this.form.submitted || !this.form.dirty;
      if (!validate) {
        const subject = new Subject<boolean>();
        this.showValidate('Salir de crear usuario', '¿Está seguro de que desea salir de la página crear usuario?', 'warning');
        this.subject = subject;
        return subject.asObservable();
      }
    }
    return true;
  }

  formUser(form) {
    this.form = form;
  }

  createUser(event: any): void {
    this.api.post('/users/create', event).then(() => {
      this.enviado = true;
      this.showModal('Crear usuario', 'Usuario creado exitosamente', 'success');
    },
      (resultError) => {
        this.resultSendUser(resultError.error);
      });
  }

  showValidate(header: string, message: string, actionModal: any) {
    this.modal.header = header;
    const btnFooter: TableItem[] = [
      {
        id: 'btnErrorClose',
        text: 'No',
        class: 'btnCloseError',
        events: [
          {
            name: 'click',
            event: () => {
              this.closeModal();
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
              this.closeModal();
              this.subject.next(true);
              this.subject.complete();
            }
          }
        ]
      }
    ];
    this.settingModal(message, actionModal, btnFooter);
    this.successful = actionModal === 'success';
  }

  showModal(header: string, message: string, actionModal: any) {
    this.modal.header = header;
    const btnFooter: TableItem[] = [
      {
        id: 'btnErrorClose',
        text: 'Cerrar',
        class: 'btnCloseError',
        events: [
          {
            name: 'click',
            event: () => {
              this.closeModal();
              if (actionModal === 'success') {
                this.router.navigate([`/dashboard/administrator-user/`]);
              }
            }
          }
        ]
      }
    ];
    this.settingModal(message, actionModal, btnFooter);
    this.successful = actionModal === 'success';
  }

  private resultSendUser(errorMessage: any) {
    let header = '';
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
      case "FORM_VALIDATE":
        header = 'Alerta';
        message = 'Hay datos sin guardar, ¿Desea salir de la página?';
        break;
      default: // 'INTERNAL_SERVER_ERROR'
        header = 'Error al crear el usuario';
        message = 'El proceso no se terminó satisfactoriamente. Intente nuevamente en unos segundos.';
        break;
    }
    this.showModal(header, message, 'error');
  }
}
