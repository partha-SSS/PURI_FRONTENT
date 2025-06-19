export class td_rd_installment {
  acc_num: string;
  instl_no: number;
  due_dt: Date;
  instl_dt: Date;
  status: string;
  ardb_cd:string;
  td_rd_installment(){
    this.ardb_cd= localStorage.getItem('__ardb_cd');
  }
}
