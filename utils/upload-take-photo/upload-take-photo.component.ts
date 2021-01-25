import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-upload-take-photo',
  templateUrl: './upload-take-photo.component.html',
  styleUrls: ['./upload-take-photo.component.scss']
})
export class UploadTakePhotoComponent implements OnInit {
  @Output() public resultImage = new EventEmitter<string>();
  @Input() imageResult: any;
  @Input() disabledUserForm: string;
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;
  public menuDialog = false;
  public imgDefaultView = true;
  public imageDefault: any = 'assets/images/avatar.png';
  public imageResultView = false;

  constructor(public dialog: MatDialog) { }
  ngOnInit() {
    if (this.imageResult) {
      this.imgDefaultView = false;
      this.imageResultView = true;
    }
  }
  public openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }
  openDialog(actionPhoto: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { action: actionPhoto, img: this.imageResult },
      panelClass: 'stylesDialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.img) {
        this.resultImage.emit(result.img);
        this.menuDialog = true;
        this.imgDefaultView = false;
        this.imageResult = result.img;
        this.imageResultView = true;
      }
    });
  }
  public deletePhoto() {
    this.imageResult = '';
    this.imgDefaultView = true;
    this.imageResultView = false;
    this.menuDialog = false;
  }
}
