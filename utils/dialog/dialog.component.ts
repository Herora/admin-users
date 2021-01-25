import { Component, OnInit, Inject, ElementRef, ViewChild, OnChanges, SimpleChanges, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export interface DialogData {
  action: string;
  img?: any;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnChanges {
  public imgDefaultUpload = true;
  public imgDefaultView = 'assets/images/imgDefaultUpload.svg';
  public image2: any;
  @ViewChild('imgInput', { static: true }) imageObj: ElementRef;
  public image: any;
  public view = false;
  public actionPhoto = '';
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
  const urlsIcon = [
    { name: 'Xclose', url: 'assets/icons/close.svg' },
  ];
  urlsIcon.forEach(e => {
    this.iconSvg(e.name, e.url);
  });
}
private iconSvg(name: string, url: string) {
  this.matIconRegistry.addSvgIcon(name, this.domSanitizer.bypassSecurityTrustResourceUrl(url));
}
  ngOnInit(): void {
    this.actionPhoto = this.data.action;
    if (this.data.img) {
      this.image2 = this.data.img;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  sendPhoto() {
    this.dialogRef.close({
      img: this.image2
    });
  }
  uploadPhoto(files: any) {
    const fileData = files.target.files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = () => {
      this.imgDefaultUpload = false;
      this.image = reader.result;
    };
  }
  deletePhoto() { }

  uploadImage(event) {
    this.image2 = event;
  }
}
