

export class td_intt_dtls {
  public ardb_cd:string;
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public renew_id: number;
  public intt_amt: number;
  public trans_cd: number;
  public calc_dt: Date;
  public paid_dt: Date;
  public paid_status: string;

  td_intt_dtls(){
     this.ardb_cd = localStorage.getItem('__ardb_cd');
  }
}
