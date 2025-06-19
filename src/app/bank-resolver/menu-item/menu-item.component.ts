import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuConfig } from '../Models';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @Input() items: MenuConfig[];
  @ViewChild('childMenu') public childMenu;

  constructor(public router: Router) {
  }
  ngOnInit() {
  }
}
