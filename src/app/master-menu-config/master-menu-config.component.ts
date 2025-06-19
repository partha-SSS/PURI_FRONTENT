import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';
import { submenu, screenlist, NewConfigRec, BankConfig, MenuConfig } from '../bank-resolver/Models';
// import { BankConfiguration } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { concat } from 'rxjs';


@Component({
  selector: 'app-master-menu-config',
  templateUrl: './master-menu-config.component.html',
  styleUrls: ['./master-menu-config.component.css']
})
export class MasterMenuConfigComponent implements OnInit {

  constructor(private router: ActivatedRoute,
    private location: Location,
    private rstSvc: RestService,
    private confSvc: ConfigurationService
  ) { }



  // bnkConfigList: BankConfig[] = [];
  // bnkConfigSubList: BankConfig[] = [];

  menuId = 0;
  parentMenuId = 0;

  menuConfigListMaster: MenuConfig[] = [];
  menuConfigLevel1List: MenuConfig[] = [];
  menuConfigLevel1Temp = new MenuConfig();

  menuConfigLevel2List: MenuConfig[] = [];
  menuConfigLevel2Temp = new MenuConfig();

  menuConfigLevel3List: MenuConfig[] = [];
  menuConfigLevel3Temp = new MenuConfig();

  menuConfigLevel4List: MenuConfig[] = [];
  menuConfigLevel4Temp = new MenuConfig();

  menuConfigInsertList: MenuConfig[] = [];

  bankconfigurationList: BankConfig[] = [];

  // menuConfig =  new MenuConfig();

  masterBankName = 'MASTER';
  menuName = "";
  screenName1 = "";
  screenName2= "";

  moduleFlg = false;
  saveAllFlg = false;

  // bankUrl: string;
  // BC: BankConfiguration[] = [];
  // masterConfig: BankConfiguration[] = [];
  // allBankConfig: any;

  // masterBankConfigMst = new BankConfigMst();

  tempSubMenu = new submenu();
  viewSubmenu: submenu[];
  tempScreenlist = new screenlist();
  viewScreenlist: screenlist[];

  tempMasterNewConfigRec = new NewConfigRec();
  // tempNewConfigRec = new NewConfigRec();
  tempAllBankNewConfigRecList: NewConfigRec[] = [];


spinner = true;

showLevel2Flg = false;
showLevel3Flg = false;
showLevel4Flg = false;

createModuleFlg = false;
createMenuFlg = false;
createSubMenuFlg = false;
createScreenFlg = false;


  alertMsg = '';
  showAlert = false;
  showAlert2 = false;

  ngOnInit(): void {
    //this.getAllConfiguration();
   // this.getAllBankConfigData();
    this.getMasterMenuConfig();
    this.getBankConfigDtls();
  }



  private getMasterMenuConfig() {
    this.spinner = true;
    debugger;
    var mc =  new MenuConfig();
    mc.bank_config_id = 0;
    this.rstSvc.addUpdDelMaster<any>('Admin/GetMenuConfig', mc).subscribe(
      res => {
        this.menuConfigListMaster = res;
        this.filterMenuList(0, 1, null);
        this.spinner = false;
        debugger;
      },
      err => {
        debugger;
        this.showAlert2 = true;
        this.alertMsg = 'Unable to Get Menu Config Records..';
      }
    );
  }

  private getBankConfigDtls() {
    const lst:any=[{
      "BANK_CONFIG_ID": 239,
      "BANK_NAME": "PURIUATUX",
      "BANK_DESC": "UTKAL",
      "SERVER_IP": "puriuat.purdcsltd.com",
      "ACTIVE_FLAG": "Y",
      "DEL_FLAG": "N",
      "CREATED_BY": "ADMIN_MASTER",
      "CREATED_DT": "24/10/2024 15:16:48",
      "UPDATED_BY": "ADMIN_ARDB_MASTER",
      "UPDATED_DT": "24/10/2024 15:16:48",
      "USER1": "ufcsl",
      "PASS1": "signature",
      "USER2": "ufcsl",
      "PASS2": "signature",
      "SMS_PROVIDER": "1",
      "DB_SERVER_IP": "synergic-db2.ckoqkwog5p58.ap-south-1.rds.amazonaws.com:1521/syndb2"
    }]
    debugger;
    this.bankconfigurationList = [];
    this.bankconfigurationList = lst;
    // this.rstSvc.addUpdDelMaster<any>('Admin/GetBankConfigDtlsNoPass', null).subscribe(
    //   res => {
    //     debugger;
    //     this.bankconfigurationList = lst;
    //   },
    //   err => {
    //     debugger;
    //     this.showAlert2 = true;
    //     this.alertMsg = 'Unable to Bank Config Records..';
    //   }
    // );
  }

  private getMenuId() {
    this.rstSvc.addUpdDelMaster<any>('Admin/GetMenuId', null).subscribe(
      res => {
        debugger;
        this.menuId = res;
        this.spinner = false;
      },
      err => {
        debugger;
        this.spinner = false;
        this.showAlert2 = true;
        this.alertMsg = 'Unable to Get Menu Id..';
      }
    );
  }

resetListAndFlag()
{
  this.createModuleFlg = false;
  this.createMenuFlg = false;
  this.createSubMenuFlg = false;
  this.createScreenFlg = false;

  this.showLevel2Flg = false;
  this.showLevel3Flg = false;
  this.showLevel4Flg = false;

  this.menuConfigInsertList = [];
  this.saveAllFlg = false;

  this.menuConfigInsertList = [];
  this.menuConfigLevel1Temp = new MenuConfig();
  this.menuConfigLevel2Temp = new MenuConfig();
  this.menuConfigLevel3Temp = new MenuConfig();
  this.menuConfigLevel4Temp = new MenuConfig();
}


  filterMenuList(parentId: number, level: number , name: string) {
    debugger;
    this.cancelCreateModule();
    this.cancelCreateMenu();
    this.cancelCreateSubMenu();
    this.cancelCreateScreen();

    this.parentMenuId = parentId;

    if (level == 1) {
      this.menuConfigLevel1List = this.menuConfigListMaster.filter(m => m.level_no === level && m.parent_menu_id == parentId);
    }

    if (level == 2) {
      this.menuName = name;
      this.showLevel2Flg = true;
      this.showLevel3Flg = false;
      this.showLevel4Flg = false;
      this.menuConfigLevel2List = this.menuConfigListMaster.filter(m => m.level_no === level && m.parent_menu_id == parentId);
     }

    if (level == 3) {
      debugger;
      this.screenName1 = name;
      this.showLevel3Flg = true;
      this.showLevel4Flg = false;
      this.menuConfigLevel3List = this.menuConfigListMaster.filter(m => m.level_no === level && m.parent_menu_id == parentId);
    }

    if (level == 4) {
      debugger;
      this.screenName2 = name;
      this.showLevel4Flg = true;
      this.menuConfigLevel4List = this.menuConfigListMaster.filter(m => m.level_no === level && m.parent_menu_id == parentId);
    }
  }


  createModule() {
    debugger;
    this.getMenuId();
    this.createModuleFlg = true;
    this.menuConfigLevel1Temp = new MenuConfig();

    this.showLevel2Flg = false;
    this.showLevel3Flg = false;
    this.showLevel4Flg = false;
    this.cancelCreateMenu();
  }

  acceptModule() {
    debugger;
    if (this.menuConfigLevel1Temp.menu_name !== undefined && this.menuConfigLevel1Temp.menu_name !== '') {
      this.menuConfigInsertList = [];
      this.menuConfigLevel1Temp.bank_name = this.masterBankName;
      this.menuConfigLevel1Temp.bank_config_id = 0;
      this.menuConfigLevel1Temp.parent_menu_id = 0;
      this.menuConfigLevel1Temp.menu_id = this.menuId;
      this.menuConfigLevel1Temp.level_no = 1;
      this.menuConfigLevel1Temp.is_screen = 'N';
      this.menuConfigLevel1Temp.ref_page = null;
      this.menuConfigLevel1Temp.active_flag = 'Y';

      this.menuConfigInsertList.push(this.menuConfigLevel1Temp);

      this.generateMenuConfigInsertListforAll(0, 1, this.menuConfigLevel1Temp.menu_name , this.menuConfigLevel1Temp.is_screen , this.menuConfigLevel1Temp.ref_page);

      // this.menuConfigLevel1Temp = new MenuConfig();
      this.showAlert = false;
    }
    else {
      this.showAlert = true;
      this.alertMsg = 'Blank module name!!';
    }
  }

    cancelCreateModule() {
      this.createModuleFlg = false;
      this.menuConfigLevel1Temp = new MenuConfig();
      this.menuConfigInsertList = [];
      this.saveAllFlg = false;
    }


    createMenu() {
      debugger;
      this.getMenuId();
      this.createMenuFlg = true;
      this.menuConfigLevel2Temp = new MenuConfig();

      this.showLevel3Flg = false;
      this.showLevel4Flg = false;
    }

    acceptMenu() {
      debugger;
      if (this.menuConfigLevel2Temp.menu_name !== undefined && this.menuConfigLevel2Temp.menu_name !== '') {
        this.menuConfigInsertList = [];
        this.menuConfigLevel2Temp.bank_name = this.masterBankName;
        this.menuConfigLevel2Temp.bank_config_id = 0;
        this.menuConfigLevel2Temp.parent_menu_id = this.parentMenuId;
        this.menuConfigLevel2Temp.menu_id = this.menuId;
        this.menuConfigLevel2Temp.level_no = 2;
        this.menuConfigLevel2Temp.is_screen = 'N';
        this.menuConfigLevel2Temp.ref_page = null;
        this.menuConfigLevel2Temp.active_flag = 'Y';

        this.menuConfigInsertList.push(this.menuConfigLevel2Temp);

        this.generateMenuConfigInsertListforAll(this.parentMenuId, 2, this.menuConfigLevel2Temp.menu_name , this.menuConfigLevel2Temp.is_screen , this.menuConfigLevel2Temp.ref_page);

        // this.menuConfigLevel2Temp = new MenuConfig();
        this.showAlert = false;
      }
      else {
        this.showAlert = true;
        this.alertMsg = 'Blank Menu name!!';
      }
    }

    cancelCreateMenu() {
      debugger;
      this.createMenuFlg = false;
      this.menuConfigLevel2Temp = new MenuConfig();
      this.menuConfigInsertList = [];
      this.saveAllFlg = false;
    }


    createSubMenu() {
      debugger;
      this.getMenuId();
      this.createSubMenuFlg = true;
      this.menuConfigLevel3Temp = new MenuConfig();

      this.showLevel4Flg = false;
    }

    acceptSubMenu() {
      debugger;
      if ((this.menuConfigLevel3Temp.menu_name !== undefined && this.menuConfigLevel3Temp.menu_name !== ''
          && this.menuConfigLevel3Temp.is_screen == undefined && this.menuConfigLevel3Temp.is_screen !== 'Y') ||
          ( this.menuConfigLevel3Temp.ref_page !== undefined && this.menuConfigLevel3Temp.ref_page !== '') ) {
        this.menuConfigInsertList = [];
        this.menuConfigLevel3Temp.bank_name = this.masterBankName;
        this.menuConfigLevel3Temp.bank_config_id = 0;
        this.menuConfigLevel3Temp.parent_menu_id = this.parentMenuId;
        this.menuConfigLevel3Temp.menu_id = this.menuId;
        this.menuConfigLevel3Temp.level_no = 3;
        // this.menuConfigLevel3Temp.is_screen = 'N';
        // this.menuConfigLevel3Temp.ref_page = null;
        this.menuConfigLevel3Temp.active_flag = 'Y';

        this.menuConfigInsertList.push(this.menuConfigLevel3Temp);

        this.generateMenuConfigInsertListforAll(this.parentMenuId, 3, this.menuConfigLevel3Temp.menu_name , this.menuConfigLevel3Temp.is_screen , this.menuConfigLevel3Temp.ref_page);

        // this.menuConfigLevel3Temp = new MenuConfig();
        this.showAlert = false;
      }
      else {
        this.showAlert = true;
        this.alertMsg = 'Blank Sub-Menu/Screen name!!';
      }
    }

    cancelCreateSubMenu() {
      debugger;
      this.createSubMenuFlg = false;
      this.menuConfigLevel3Temp = new MenuConfig();
      this.menuConfigInsertList = [];
      this.saveAllFlg = false;
    }

    createScreen() {
      debugger;
      this.getMenuId();
      this.createScreenFlg = true;
      this.menuConfigLevel4Temp = new MenuConfig();
    }

    acceptScreen() {
      debugger;
      if (this.menuConfigLevel4Temp.menu_name !== undefined && this.menuConfigLevel4Temp.menu_name !== ''
          && this.menuConfigLevel4Temp.ref_page !== undefined && this.menuConfigLevel4Temp.ref_page !== '') {
        this.menuConfigInsertList = [];
        this.menuConfigLevel4Temp.bank_name = this.masterBankName;
        this.menuConfigLevel4Temp.bank_config_id = 0;
        this.menuConfigLevel4Temp.parent_menu_id = this.parentMenuId;
        this.menuConfigLevel4Temp.menu_id = this.menuId;
        this.menuConfigLevel4Temp.level_no = 4;
        // this.menuConfigLevel3Temp.is_screen = 'N';
        // this.menuConfigLevel3Temp.ref_page = null;
        this.menuConfigLevel4Temp.active_flag = 'Y';

        this.menuConfigInsertList.push(this.menuConfigLevel4Temp);

        this.generateMenuConfigInsertListforAll(this.parentMenuId, 4, this.menuConfigLevel4Temp.menu_name , this.menuConfigLevel4Temp.is_screen , this.menuConfigLevel4Temp.ref_page);

        // this.menuConfigLevel4Temp = new MenuConfig();
        this.showAlert = false;
      }
      else {
        this.showAlert = true;
        this.alertMsg = 'Blank Screen name!!';
      }
    }

    cancelCreateScreen() {
      debugger;
      this.createScreenFlg = false;
      this.menuConfigLevel4Temp = new MenuConfig();
      this.menuConfigInsertList = [];
      this.saveAllFlg = false;
    }


  generateMenuConfigInsertListforAll(parentMenuId: number, level: number, menuName: string, isScreen: string, page: string) {
    debugger;
    if (this.bankconfigurationList != undefined && this.bankconfigurationList != null && this.bankconfigurationList.length > 0) {
      for (let i = 0; i < this.bankconfigurationList.length; i++) {
        if (this.bankconfigurationList[i].bank_name.toUpperCase() !== this.masterBankName) {
          var menuConfig = new MenuConfig();
          menuConfig.bank_name = this.bankconfigurationList[i].bank_name;
          menuConfig.bank_config_id = this.bankconfigurationList[i].BANK_CONFIG_ID;
          menuConfig.parent_menu_id = parentMenuId;
          menuConfig.menu_id = this.menuId;
          menuConfig.level_no = level;
          menuConfig.menu_name = menuName;
          menuConfig.is_screen = isScreen
          menuConfig.ref_page = page;
          menuConfig.active_flag = 'Y';
          this.menuConfigInsertList.push(menuConfig);
        }
      }
    }
    this.saveAllFlg = true;
    debugger;
  }

  navigateBack() {
    this.location.back();
  }


  insertMenuConfigList()
  {
    debugger;
    if(this.menuConfigInsertList !== null && this.menuConfigInsertList.length > 0)
    {
        this.spinner = true;
        debugger;
        this.rstSvc.addUpdDelMaster<any>('Admin/InsertMenuConfig', this.menuConfigInsertList).subscribe(
          res => {
            this.spinner = false;
            this.alertMsg = "Data Inserted Successfully....";
            this.showAlert = true;
            debugger;
            this.resetListAndFlag();
            this.getMasterMenuConfig();
          },
          err => {
            debugger;
            this.alertMsg = "Data Not Inserted Successfully....";
            this.showAlert2 = true;
          }
        );


    }
  }


  closeAlert() {
    this.showAlert = false;
    this.showAlert2 = false;
  }

}
