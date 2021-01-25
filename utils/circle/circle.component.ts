import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {
  @Input() public porcentage: number;
  public texto = '0 de 2';
  constructor() { }

  ngOnInit(): void { }
  public textPercentage(): string {
    let text = '';
    switch (this.porcentage) {
      case 50:
        text = '1 de 2';
        break;
      case 100:
        text = '2 de 2';
        break;

      default:
        text = '0 de 2';
        this.porcentage = 0;
        break;
    }
    return text;
  }
}
