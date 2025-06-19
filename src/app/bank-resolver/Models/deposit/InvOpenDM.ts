import { SystemValues, td_def_trans_trf } from '..';
import { tm_deposit } from '../tm_deposit';
import { td_accholder } from './td_accholder';
import { td_introducer } from './td_introducer';
import { td_nominee } from './td_nominee';
import { td_signatory } from './td_signatory';
import { tm_denomination_trans } from './tm_denomination_trans';
import { tm_transfer } from './tm_transfer';

export class InvOpenDM
{
  public sys:SystemValues;
  public  tmdepositInv: tm_deposit;
  public  tmdepositrenewInv: tm_deposit;
  public  tdintroducer: td_introducer[] = [];
  public  tdnominee: td_nominee[] = [];
  public  tdsignatory: td_signatory[] = [];
  public  tdaccholder: td_accholder[] = [];
  // public  tmdenominationtrans: tm_denomination_trans[] = [];

  public  tddeftrans: td_def_trans_trf;
  public  tddeftranstrf: td_def_trans_trf[] = [];
  public  tmtransfer: tm_transfer[] = [];

  InvOpenDM(){
   this.tmdepositInv.ardb_cd= this.sys.ardbCD;
   this.tmdepositrenewInv.ardb_cd= this.sys.ardbCD;
  //  this.tddeftrans.ardb_cd =  this.sys.ardbCD;
  //  this.tdintroducer: td_introducer[] = [];
  //  this.tdnominee: td_nominee[] = [];
  //  this.tdsignatory: td_signatory[] = [];
  //  this.tdaccholder: td_accholder[] = [];
  //  this.tmdenominationtrans: tm_denomination_trans[] = [];
  
  //  this.tddeftrans: td_def_trans_trf;
  //  this.tddeftranstrf: td_def_trans_trf[] = [];
  //  this.tmtransfer: tm_transfer[] = [];
  
  }


}

