import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges, ɵConsole } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/core/https/http.service';
import { IRole } from 'src/app/core/models/irole';
import { MatOption } from '@angular/material/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { User } from 'src/app/core/models/user/user';
import { isNumber } from 'util';
import { FormCanDeactivate } from 'src/app/shareds/form-validate/form-can-deactivate';
import { PhoneNumberPreffix } from '../../../../../../core/pipes/phoneNumberPreffix';
import { PhoneNumberSuffix } from '../../../../../../core/pipes/phoneNumberSuffix';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
  providers: [ PhoneNumberPreffix, PhoneNumberSuffix ]
})
export class FormUserComponent extends FormCanDeactivate implements OnInit, OnChanges {
  @Input() public header: string;
  @Input() public buttonName: string;
  @Input() public userForm: User;
  @Input() public successful = false;
  @Input() public IsNew: Boolean;
  @Output() public resultForm = new EventEmitter<any>();
  @Output() formUser = new EventEmitter<any>();
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('form')
  public form: NgForm;
  public user: FormGroup;
  public title = 'Tipo de documento*';
  public porcentage = 0;
  public column1 = '1';
  public column2 = '2';
  public back = false;
  public next = true;
  public userName = '';
  public image: any;
  private personTypeIds = 1;
  public identificationType: any[] = [];
  public roles: any[] = [];
  phone: any;
  phoneCountry: any;

  constructor(private api: ApiService, private phoneNumberPreffix: PhoneNumberPreffix, private phoneNumberSuffix: PhoneNumberSuffix) { super(); }

  ngOnInit(): void {
    this.getRoles();
    this.getIdentificationTypes();
    const user = this.convertUser();
    this.userName = user.userName;
    this.image = user.image;
    const disabledUser = this.buttonName ? false : true;
    this.user = new FormGroup({
      personTypeId: new FormControl(this.personTypeIds),
      identificationTypeId: new FormControl({ value: user.identificationTypeId, disabled: disabledUser }, [Validators.required]),
      identificationNumber: new FormControl({ value: user.identificationNumber, disabled: disabledUser }, [Validators.required, Validators.pattern('^[0-9]+$')]),
      names: new FormControl({ value: user.names, disabled: disabledUser }, [Validators.required, Validators.pattern('[A-Za-z0-9. -]{1,30}'), Validators.maxLength(30)]),
      surnames: new FormControl({ value: user.surnames, disabled: disabledUser }, [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]),
      email: new FormControl({ value: user.email, disabled: disabledUser }, [Validators.required, Validators.email]),
      phone: new FormControl({ value: user.phone, disabled: disabledUser }, [Validators.required, Validators.pattern('[0-9]*')]),
      mobile: new FormControl({ value: user.mobile, disabled: disabledUser }, []),
      image: new FormControl(user.image),
      rolesList: new FormControl({ value: user.rolesList, disabled: disabledUser }, [Validators.required]),
    });
    this.user.statusChanges
      .subscribe(data => {
        switch (data) {
          case 'VALID':
            this.porcentage = 100;
            break;
          case 'INVALID':
            if (this.validateFormDisplay1()) {
              this.porcentage = this.validateFormDisplay2() ? 0 : 50;
            } else {
              this.porcentage = 50;
            }
            break;
          default:
            break;
        }
        this.formUser.emit(this.form);
      });
    this.phoneCountry = this.phoneNumberPreffix.transform(user.phone);
    this.phone = this.phoneNumberSuffix.transform(user.phone);
    this.user.controls['phone'].patchValue(this.phone);
    if (user.userName === '') {
      this.createUserName();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.successful && this.user) {
      this.user.reset();
      this.onResetForm();
      this.userName = '';
    }
  }
  private validateFormDisplay2(): boolean {
    const valid = ['email', 'phone', 'rolesList'];
    let invalid = false;
    valid.forEach(e => {
      if (this.user.get(e).invalid) {
        invalid = true;
      }
    });
    return invalid;
  }
  public validateFormDisplay1(): boolean {
    const valid = ['identificationTypeId', 'identificationNumber', 'names', 'surnames'];
    let invalid = false;
    valid.forEach(e => {
      if (this.user.get(e).invalid) {
        invalid = true;
      }
    });
    return invalid;
  }
  private convertUser() {
    const user = {
      id: this.validateData('id', 0),
      identificationTypeId: this.validateData('identificationTypeId', ''),
      identificationNumber: this.validateData('identificationNumber', ''),
      names: this.validateData('names', ''),
      surnames: this.validateData('surnames', ''),
      email: this.validateData('email', ''),
      phone: this.validateData('phone', ''),
      mobile: this.validateData('mobile', ''),
      rolesList: this.validateData('rolesList', []),
      image: this.validateData('image', ''),
      userName: this.validateData('userName', '')
    };
    return user;
  }
  private validateData(control: string, defaultValue: any) {
    return this.userForm && this.userForm[control] ? this.userForm[control] : defaultValue;
  }
  createUserName() {
    if (this.IsNew || !this.userName.length) {
      this.userName = '';
      this.user.get('names').value.toLowerCase().trim().split(' ').forEach(name => {
        this.userName += name.substring(0, 1);
      });
      const firtsname = this.user.get('surnames').value.toLowerCase().split(' ');
      this.userName += firtsname[0];
      if (firtsname.length > 1) {
        for (let i = 1; i < firtsname.length; i++) {
          this.userName += firtsname[i].substring(0, 1);
        }
      }
    }
  }
  public imgOuput(event: any): void {
    this.image = event;
    this.user.get('image').setValue(event);
  }
  private onResetForm(): void {
    this.user.patchValue({
      identificationNumber: '',
      names: '',
      surnames: '',
      email: '',
      phone: '',
      mobile: '',
      rolesList: '',
      identificationTypeId: ''
    });
  }
  private getRoles(): void {
    this.api.get('/roles/active').then
      ((result: any) => {
        result.forEach(rol => {
          this.roles.push({
            id: rol.id,
            description: rol.description
          });
        });
      });
  }
  private getIdentificationTypes(): void {
    this.api.get('/users/identificationstype').then
      ((result: any) => {
        result.forEach(identificationType => {
          this.identificationType.push({
            id: identificationType.id,
            description: identificationType.description,
            abbreviation: identificationType.abbreviation
          });
        });
      });
  }
  public sendUser() {
    //this.user.controls['phone'].patchValue('(+' + this.mobileCountry + ')' + this.mobile);
    const user = Object.assign({}, this.user.value);
    user.userName = this.userName;
    user.personTypeId = this.personTypeIds;
    user.status = 1;
    if (this.userForm && this.userForm.id) {
      user.id = this.userForm.id;
    }
    this.resultForm.emit(user);
  }
  public nextform() {
    this.back = true;
    this.next = false;
  }
  public backform() {
    this.back = false;
    this.next = true;
  }
  public responsive(): string {
    let str = '';
    if (window.innerWidth < 600) {
      str = 'view-display' + (this.back ? '2' : '1');
    }
    return str;
  }
  public validateUserName() {
    if (this.IsNew || !this.userName.length ) {
      if (this.userName) {
        this.api.get('/users/username/' + this.userName).then((result: any) => {
          this.userName = result.userName;
        });
      }
    }
  }
  public validateInput(data: string) {
    let value = '';    
    const input = this.user.get(data).value==undefined?'':this.user.get(data).value.toString();
    let pattern: any;
    if (data === 'identificationNumber' || data === 'phone') {
      pattern = new RegExp('(^[0-9]{1,30}$)');
    }
    if (data === 'names' || data === 'surnames') {
      pattern = new RegExp('(^[a-zA-Z ]{1,30}$)');
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < input.length; i++) {
      if (input[i].search(pattern) !== -1) {
        value += input[i];
      }
    }
    value = (value.length > 30) ? value.substring(0, 30) : value;
    switch (data) {
      case 'identificationNumber':
        this.user.patchValue({
          identificationNumber: value
        });
        break;
      case 'phone':
        this.user.patchValue({
          phone: value
        });
        break;
      case 'names':
        this.user.patchValue({
          names: value
        });
        break;
      case 'surnames':
        this.user.patchValue({
          surnames: value
        });
        break;
    }
  }
  public errorHandler(control: string): string {
    let message = ' ';
    const errors = this.user.controls[control].errors;
    if (this.user.controls[control].touched && errors) {
      const p = Object.keys(this.user.controls[control].errors)[0];
      switch (p) {
        case 'pattern':
          message = this.errorPattern(control);
          break;
        case 'minlength':
          message = 'ERROR_MINLENGTH_NUMERIC';
          break;
        case 'email':
          message = 'Correo inválido';
          break;
        default:
          message = 'ERROR_REQUIRED_FIELD';
          break;
      }
    }
    return message;
  }
  private errorPattern(control: string): string {
    let data = '';
    switch (control) {
      case 'email':
        data = 'Correo inválido';
        break;
      case 'nit' || 'cadestreNumber':
        data = 'ALPHANUMERIC';
        break;
      default:
        data = '';
        break;
    }
    return data;
  }
}
