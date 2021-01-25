import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-cam',
  templateUrl: './cam.component.html',
  styleUrls: ['./cam.component.scss']
})
export class CamComponent implements OnInit {
  @Input() public image: string;
  @Output() public resultImage = new EventEmitter<string>();
  image2: any;
  private videoWidth = 0;
  private videoHeight = 0;
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  public constraints = {
    audio: false,
    video: true
  };

   constructor(private renderer: Renderer2) { }
   ngOnInit(): void {
   }

  public startCamera(): void {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Camara no disponible');
    }
  }

  private handleError() {}

  public attachVideo(stream: any): void {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  public capture(): void {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.saveImage();
  }
  private saveImage() {
    this.resultImage.emit(this.canvas.nativeElement.toDataURL('image/png'));
  }
}
