import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService } from './_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(){
  //  console.log(window.location)
  }
 ngOnInit(){
 // console.log("hii")
 }
  // title = 'UX'
}
