import { SystemValues, td_def_trans_trf } from '..';
import { tm_locker } from './tm_locker';
import { tm_deposit } from '../tm_deposit';
import { td_accholder } from '../deposit/td_accholder';
import { td_introducer } from '../deposit/td_introducer';
import { td_nominee } from '../deposit/td_nominee';
import { td_signatory } from '../deposit/td_signatory';
import { tm_denomination_trans } from '../deposit/tm_denomination_trans';
import { tm_transfer } from '../deposit/tm_transfer';

export class LockerOpenDM
{
  public sys:SystemValues;
  public  tmlocker: tm_locker;
  public  tdnominee: td_nominee[] = [];
  public  tdaccholder: td_accholder[] = [];
  public  tddeftrans: td_def_trans_trf;
  public  tddeftranstrf: td_def_trans_trf[] = [];
  public  tmtransfer: tm_transfer[] = [];

  AccOpenDM(){

  }


}

