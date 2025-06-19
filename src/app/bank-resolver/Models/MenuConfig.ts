export class MenuConfig {

  public bank_config_id: number;
  public parent_menu_id: number;
  public menu_id: number;

  public level_no: number;
  public menu_name: string;
  public ref_page?: string;
  
  public is_screen: string;
  public active_flag: string;
  public del_flag: string;
  public bank_name: string;

  public childMenuConfigs: MenuConfig[];
  public show: boolean;
  public iconName: string;
  public permission: string;


  public MenuConfig() {
    this.bank_config_id = 0;
    this.menu_id = 0;
    this.is_screen = 'N';
    this.active_flag = 'Y';
    this.del_flag = 'N';
    this.show = false;
  }
}
