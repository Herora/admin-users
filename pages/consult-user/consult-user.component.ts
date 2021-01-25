import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user/user';
import { ModalNotification } from 'src/app/core/models/modal-notification/modal-notification';
import { ApiService } from 'src/app/core/https/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { BreadcrumbcustomService } from '../../../../../../core/services/breadcrumbcustom/breadcrumbcustom.service';
import { RoutingPath } from '../../../../../../../environments/routing-path';

@Component({
  selector: 'app-consult-user',
  templateUrl: './consult-user.component.html',
  styleUrls: ['./consult-user.component.scss']
})
export class ConsultUserComponent implements OnInit {
  public header = 'Consultar usuario';
  public user: User;
  public successful = false;
  public modal: ModalNotification = {
    idModal: 'modalUpdateUser',
    header: '',
    showFooter: false
  };
  private userId: number;

  constructor(private api: ApiService, private _MODAL: ModalService,
              private route: ActivatedRoute, private router: Router,
              private breadcrumbcustomService: BreadcrumbcustomService) { }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.breadcrumbcustomService.setValue('administrator-user', 'id', 'name',
      `@${RoutingPath.appRouting.components.dashboard.pages.administrator_user.alias}`, this.userId);

    this.api.get(`/Users/${this.userId}`).then((result: User) => {
      this.user = result;
    }).catch(() => {
      // this.imageDefault = 'assets/images/avatar.png';
    });
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
                this.router.navigate([`/user/administrator`]);
              }
            }
          }
        ]
      }
    ];
    this.modal.actionModal = actionModal;

    this.successful = actionModal === 'success';
  }
}
