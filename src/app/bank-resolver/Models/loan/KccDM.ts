import { mm_kcc_member_dtls } from "./mm_kcc_member_dtls";
import { mm_land_register } from "./mm_land_register";
import { td_kcc_sanction_dtls } from "./td_kcc_sanction_dtls";


export class KccDM {
  public mmkccmemberdtls: mm_kcc_member_dtls;
  public mmlandregister: mm_land_register[] = [];
  public tdkccsanctiondtls: td_kcc_sanction_dtls[] = [];
  
}
