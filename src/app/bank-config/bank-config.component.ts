import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';
import { MenuConfig } from '../bank-resolver/Models';


@Component({
  selector: 'app-bank-config',
  templateUrl: './bank-config.component.html',
  styleUrls: ['./bank-config.component.css']
})
export class BankConfigComponent implements OnInit {

  constructor(private router: ActivatedRoute,
    private location: Location,
    private rstSvc: RestService,
  ) { }


  bankName: string;
  bankDesc: string;
  bankConfigId: number;

  menuConfigList: MenuConfig[] = [];

  menuConfigLevel1List: MenuConfig[] = [];
  menuConfigLevel2List: MenuConfig[] = [];
  menuConfigLevel3List: MenuConfig[] = [];
  menuConfigLevel4List: MenuConfig[] = [];

  menuConfigUpdateList: MenuConfig[] = [];

  spinner = true;

  alertMsg = '';
  showAlert = false;
  showAlert2 = false;

  showLevel2Flg = false;
  showLevel3Flg = false;
  showLevel4Flg = false;

  menuName = '';
  screenName1 = '';
  screenName2 = '';

  // menuId = 0;
  parentMenuId = 0;


  // bankConfigMst = new BankConfigMst();
  // tempMenu = new mainmenu();
  // tempManuName: string;
  // tempSubManuName: string;
  // tempSubMenu = new submenu();
  // viewSubmenu: submenu [];
  // tempScreenlist = new screenlist();
  // viewScreenlist: screenlist [];


  menuFlg = false;
  showSubMenuFlg = false;
  createSubMenuFlg = false;
  showScreenFlg = false;
  createScreenFlg = false;
  showJsonFlg = false;

  passFlg = false;
  showPass = false;


  ngOnInit(): void {
    this.router.queryParams.subscribe(
      params => {
        this.bankName = params.bankName;
        this.bankDesc = params.bankDesc;
        this.bankConfigId = params.bankConfigId;
        this.getMenuConfig();

      }
    );
  }

  resetListAndFlag() {
    this.showLevel2Flg = false;
    this.showLevel3Flg = false;
    this.showLevel4Flg = false;
    this.menuConfigUpdateList = [];
    this.getMenuConfig();
  }

  private getMenuConfig() {
    this.spinner = true;
    const mc = new MenuConfig();
    mc.bank_config_id = this.bankConfigId;
    this.rstSvc.addUpdDelMaster<any>('Admin/GetMenuConfig', mc).subscribe(
      res => {
        this.menuConfigList = res;
        this.filterMenuList(0, 1, null);
        this.spinner = false;
      },
      err => {
        this.showAlert2 = true;
        this.alertMsg = 'Unable to Get records...';
      }
    );
  }

  filterMenuList(parentId: number, level: number, name: string) {
    this.parentMenuId = parentId;

    if (level === 1) {
      this.resetMenu();
      this.menuConfigLevel1List = this.menuConfigList.filter(m => m.level_no === level && m.parent_menu_id === parentId);
    }

    if (level === 2) {
      this.menuName = name;
      this.showLevel2Flg = true;
      this.resetSubMenu();
      this.menuConfigLevel2List = this.menuConfigList.filter(m => m.level_no === level && m.parent_menu_id === parentId);
    }

    if (level === 3) {
      this.screenName1 = name;
      this.showLevel3Flg = true;
      this.resetScreen();
      this.menuConfigLevel3List = this.menuConfigList.filter(m => m.level_no === level && m.parent_menu_id === parentId);
    }

    if (level === 4) {
      this.screenName2 = name;
      this.showLevel4Flg = true;
      this.menuConfigLevel4List = this.menuConfigList.filter(m => m.level_no === level && m.parent_menu_id === parentId);
    }
  }
  navigateBack() {
    this.location.back();
  }


  resetModule() {
    this.filterMenuList(0, 1, null);
    this.menuConfigLevel1List = [];
    this.showLevel2Flg = false;
    this.showLevel3Flg = false;
    this.showLevel4Flg = false;
  }

  resetMenu() {
    this.menuConfigLevel2List = [];
    this.showLevel3Flg = false;
    this.showLevel4Flg = false;
  }

  resetSubMenu() {
    this.menuConfigLevel3List = [];
    this.showLevel4Flg = false;

  }

  resetScreen() {
    this.menuConfigLevel4List = [];
  }


  closeAlert() {
    this.showAlert = false;
    this.showAlert2 = false;
  }


  updateMenuConfigList() {
    this.spinner = true;
    this.rstSvc.addUpdDelMaster<any>('Admin/UpdateMenuConfig', this.menuConfigList).subscribe(
      res => {
        this.spinner = false;
        this.alertMsg = 'Data Updated Successfully....';
        this.showAlert = true;
        this.resetListAndFlag();
        this.getMenuConfig();
      },
      err => {
        this.showAlert2 = true;
        this.alertMsg = 'Data Not Updated....';
      }
    );
  }
}
