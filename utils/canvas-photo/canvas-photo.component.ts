import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  Renderer2,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-canvas-photo',
  templateUrl: './canvas-photo.component.html',
  styleUrls: ['./canvas-photo.component.scss']
})
export class CanvasPhotoComponent implements OnInit, OnChanges {
  @Input() public image: string;
  @Output() public resultImage = new EventEmitter<string>();
  @ViewChild('img2', { static: true }) public img: ElementRef;
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (changes && changes.image) {
      setTimeout(() => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this.img.nativeElement, 0, 0, 200, 200);
        this.saveImage();
      }, 100);
    }
  }

  ngOnInit(): void { }

  public right() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.translate(200, 0);
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(this.img.nativeElement, 0, 0, 200, 200);
    this.saveImage();
  }
  public left() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    const x = ctx.canvas.width;
    const y = ctx.canvas.height;
    ctx.translate(x - y, y);
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.translate(0, - (y - x));
    ctx.drawImage(this.img.nativeElement, 0, 0, y, x);
    this.saveImage();
  }
  private saveImage() {
    this.resultImage.emit(this.canvas.nativeElement.toDataURL('image/png'));
  }
}
