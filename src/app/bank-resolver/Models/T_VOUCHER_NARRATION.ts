import { T_VOUCHER_DTLS } from '.';

export class T_VOUCHER_NARRATION {
  public brn_cd: string;
  public voucher_status: string;
  public voucher_typ: string; 
  public voucher_id: number;
  public voucher_dt: Date;
  public narration: string;
  public vd : T_VOUCHER_DTLS[]=[];
  public redFlag:boolean

}
