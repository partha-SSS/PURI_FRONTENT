import { baseModel } from '../baseModel';

export class tm_subsidy extends baseModel {
        public ardb_cd:string = localStorage.getItem('__ardb_cd');
        public brn_cd:string;
        public loan_id:any; 
        public loan_acc_no:string;
        public start_dt:any;
        // public start_dt:Date;
        public distribution_dt:any;
        // public distribution_dt:Date;
        public subsidy_amt:Number;
        public subsidy_type:string;  
        public subsidy:Number;
        public del_flag:string; 
        public modified_by:string;
        public modified_dt:string;
}