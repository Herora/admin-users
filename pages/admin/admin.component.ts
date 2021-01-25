import { Component, OnInit, Injector } from '@angular/core';
import { Table } from '../../../../../../core/models/table/table';
import { SettingTable } from '../../../../../../core/models/setting-table/setting-table';
import { BitstableService } from '../../../../../../core/services/bitstable/bitstable.service';
import { AbstractTable } from '../../../../../../core/models/abstracts/abstract-table/abstract-table';
import { PhoneNumberSuffix } from '../../../../../../core/pipes/phoneNumberSuffix';
import { SessionState } from 'http2';
import { LocalStorageService } from '../../../../../../core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [ PhoneNumberSuffix ]
})
export class AdminComponent extends AbstractTable implements OnInit {
  public search: any;
  public userName: any;
  public dataOriginal = [];
  constructor(injector: Injector, private bitsService: BitstableService,
              private phoneNumberSuffix: PhoneNumberSuffix, private localStorageService: LocalStorageService) {
    super(injector);
  }
  ngOnInit() {
    this.permitsButton('CONFIG_ADMINUSER');
    this.placeholder = 'USER_PLACEHOLDER';
    this.getUser();
  }
  public getUser() {
    const dataTable = [];
    this.titleTable = {
      id: 'rol',
      name: 'Administración de usuarios',
      create: {
        id: 'btn--create-user',
        route: '/dashboard/administrator-user/create',
        tooltip: 'Crear usuario'
      }
    };

    let searchId: any;
    let search: any;
    if (this.search !== undefined) {
      searchId = this.search.id;
      search = this.search.search;
    }

    this.consultEndpointPost('/users', search, searchId, 'icon_home');
  }
  public action(event: any) {
    if (event.action) {
      this.actionElements(event.action);
    }
    if (event.paginator) {
      this.actionPaginator(event.paginator);
    }
  }
  private actionElements(event: any) {
    const element = this.searchAction(event);
    switch (element.action) {
      case 'btn--table-row-edit':
        this.router.navigate([`/dashboard/administrator-user/modify/${element.id}`]);
        break;
      case 'btn--table-row-view':
        this.router.navigate([`/dashboard/administrator-user/consult/${element.id}`]);
        break;
      case 'btn--table-row-delete':
        this.modalDelete(element.id);
        break;
      case 'chk--table-row-status':
        this.modalChageStatus(element.id, (event.state ? 1 : 0));
        break;
      default:
        console.log('aqui va el del check u otro');
        break;
    }
  }
  public modalChageStatus(roleId: number, state: number) {
    this.btnYesNo[0].events = [
      {
        name: 'click',
        event: () => {
          this.closeModal();
          this.changeStatus(roleId, state);
        }
      }
    ];
    this.btnYesNo[1].events = [
      {
        name: 'click',
        event: () => {
          this.closeModal();
          this.getUser();
        }
      }
    ];
    this.modal.header = `${state === 0 ? 'Inactivar' : ' Activar'} el usuario`;
    this.settingModal(`¿Está seguro que desea  ${state === 0 ? 'inactivar' : ' activar'} el Usuario?`, 'warning', this.btnYesNo);
  }
  private changeStatus(roleId: number, state: number) {
    this.api.put(`/users/${roleId}/state/${state}`).then(() => {
      this.getUser();
      this.settingModal(`Se ha ${state === 0 ? 'inactivado' : ' activado'} el Usuario.`, 'success');
      this.modal.btnClose.events = [
        {
          name: 'click',
          event: () => {
            this.closeModal();
          }
        }
      ];
    }, (errorMessage: any) => {
      let header = '';
      let message;
      switch (errorMessage.error.Message) {
        case 'USER_CURRENT':
          header = 'No se puede desactivar';
          message = 'No se puede desactivar el usuario actual';
          break;
          case 'USER_ASSOCIATED_INDEPENDENT_UNIT':
          header = 'No se puede desactivar';
          message = 'No fue posible desactivar el usuario, se encuentra asociado a una Unidad Independiente';
          break;
        default: // 'INTERNAL_SERVER_ERROR'
          header = 'Error al crear al desactivar';
          message = 'El proceso no se terminó satisfactoriamente. Intente nuevamente en unos segundos';
          break;
      }
      this.modal.header = header;
      this.settingModal(message, 'error');
      this.modal.btnClose.events = [{ name: 'click', event: () => { this.closeModal(); } }];
      this.getUser();
    });
  }
  public actionPaginator(event: any) {
    this.paginator.quantityToShow = event.quantityToShow;
    this.paginator.page = event.page;
    this.getUser();
  }
  private deleteUser(id: number) {
    this.api.delete(`/users/${id}`).then(() => {
      this.settingModal('Se ha realizado la eliminación del usuario.', 'success');
      this.modal.btnClose.events = [
        {
          name: 'click',
          event: () => {
            this.getUser();
            this.closeModal();
          }
        }
      ];
    }, (errorMessage: any) => {
      let header = '';
      let message;
      switch (errorMessage.error.Message) {
        case 'USER_CURRENT':
          header = 'No se puede eliminar';
          message = 'No se puede eliminar el usuario actual';
          break;
        case 'USER_ASSOCIATED_INDEPENDENT_UNIT':
          header = 'No se puede eliminar';
          message = 'No fue posible eliminar el usuario, se encuentra asociado a una Unidad Independiente';
          break;
        default: // 'INTERNAL_SERVER_ERROR'
          header = 'Error al eliminar';
          message = 'El proceso no se terminó satisfactoriamente. Intente nuevamente en unos segundos';
          break;
      }
      this.modal.header = header;
      this.settingModal(message, 'error');
      this.modal.btnClose.events = [{ name: 'click', event: () => { this.closeModal(); } }];
    });
  }
  private modalDelete(id: number) {
    this.btnYesNo[0].events = [
      {
        name: 'click',
        event: () => {
          this.closeModal();
          this.deleteUser(id);
          this.getUser();
        }
      }
    ];
    this.modal.header =`Eliminar usuario ${this.getRoleDescriptionById(id).toUpperCase()}`;
    this.settingModal('¿Está seguro que desea eliminar este usuario?', 'warning', this.btnYesNo);
  }
  public searchFilter(search: any) {
    this.search = search;
    if (!(search.id && search.search === '')) {
      if (search.id) {
        this.consultEndpointPost('/users/filter', search.search, search.id, 'icon_home');
      } else {
        this.consultEndpointPost('/users', search.search, search.id);
      }
    } else {
      this.paginator.page = 1;
      this.consultEndpointPost('/users', undefined, undefined);
    }
  }

  private  getRoleDescriptionById(id: number) {
    
    this.userName = this.dataOriginal.find(user => user.id === id).userName;
    
   return this.userName == null ? `${this.dataOriginal.find(user => user.id === id).names} ${this.dataOriginal.find(user => user.id === id).surnames}`:this.userName;

  }

  private consultEndpointPost(url: string, searchKeyword: string, dataId: string | undefined, icon?: string) {
    this.api.post(url, { fieldSearch: dataId, keyword: searchKeyword, pagination: this.paginator }).then((result: any) => {
      const resultSearch: any[] = [];
      if (result) {
        if (dataId && searchKeyword) {
          result.forEach((e: any) => {
            resultSearch.push(e);
          });
          this.consultFilter(resultSearch, dataId, icon);
        } else {
          this.dataIds.forEach(data => {
            this.autocomplete(data.id, data.text);
          });
          this.paginator = result.pagination;
          this.dataOriginal = result.list;
          result.list.forEach((user: any) => {
            resultSearch.push({
              id: user.id,
              Nombres: user.names + ' ' + user.surnames,
              Documento: user.identificationNumber,
              Usuario: user.userName,
              Teléfono: this.phoneNumberSuffix.transform(user.phone),
              'Fecha de creación': this.viewDate(user.created),
              'chk--table-row-status': user.status === 0 ? false : true
            });
            });
          this.templateSearch([]);
          this.sendTable(resultSearch, result.pagination);
        }
      }
      if (result && result.hasOwnProperty('list')) {
        const data = [];
        result.list.forEach(l => {
          data.push({ id: l.id, name: l.names + ' ' + l.surnames });
        });
        this.localStorageService.stringifyItem('administrator-user', data);
      }
    });
  }
}
