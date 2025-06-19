import {
  mm_title, mm_category, mm_state, mm_dist, mm_vill,
  mm_kyc, mm_service_area, mm_block, mm_customer, ShowMessage, MessageType, SystemValues, kyc_sig, mm_acc_type
} from './../../Models';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppMessageService, RestService } from 'src/app/_service';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import Utils from 'src/app/_utility/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { p_gen_param } from '../../Models/p_gen_param';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-utcustomer-profile',
  templateUrl: './utcustomer-profile.component.html',
  styleUrls: ['./utcustomer-profile.component.css'],
  providers: [DatePipe]
})
export class UTCustomerProfileComponent implements OnInit {
  @ViewChild('kycAddressNo',{static:true}) kycAddressNo:ElementRef;
  @ViewChild('kycPhotoNo',{static:true}) kycPhotoNo:ElementRef;
  @ViewChild('pan',{static:true}) pan:ElementRef;
  @ViewChild('aadhar',{static:true}) aadhar:ElementRef;
  _isDisabled = false;

  constructor(private datePipe: DatePipe, private frmBldr: FormBuilder,
    private svc: RestService, private router: Router,
    private modalService: BsModalService, private msg: InAppMessageService) { }
  get f() { return this.custMstrFrm.controls; }
  static existingCustomers: mm_customer[] = [];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  @ViewChild('netWorth', { static: true }) netWorth: TemplateRef<any>;
  accountTypeList: mm_acc_type[] = [];
  lbr_status: any = [];
  showNW:boolean;
  coustCD:any='';
  modalRef: BsModalRef;
  selectedClick=false;
  date = new Date()
  sys = new SystemValues();
  retrieveClicked = false;
  selectedCustomer: mm_customer;
  enableModifyAndDel = false;
  showMsgs: ShowMessage[] = [];
  // showMsg: ShowMessage;
  disabledOnNull=true;
  isLoading = false;
  suggestedCustomer: mm_customer[];
  titles: mm_title[] = [];
  KYCTypes: mm_kyc[] = [];
  blocks: mm_block[] = [];
  serviceAreas: mm_service_area[] = [];
  villages: mm_vill[] = [];
  villages1: mm_vill[] = [];
  states: mm_state[] = [];
  districts: mm_dist[] = [];
  categories: mm_category[] = [];
  custMstrFrm: FormGroup;
  fileToUpload: File = null;
  sucessMsgs: string[] = [];
  showNoResult=false;
  reportData2:any=[];
  reportData3:any=[];
  vill:any;
  organizationMode:boolean=false;
  showHideVill:boolean=false
  comType=[{val:1,name:'Hindu'},{val:2,name:'Muslim'},{val:3,name:'Others'}]
  castType=[{val:1,name:'General'},{val:2,name:'SC'},{val:3,name:'ST'},{val:4,name:'OBC'}]
  // image = new kyc_sig();
  // base64Image: string;
  /* possible values of operation
    New, Retrieve, Modify, delete
    We will use to globally set operation of the page
  */
  custName:Subscription
  operation: string;
  selectedBlock: mm_block;
  selectedServiceArea: mm_service_area;
  isOpenDOBdp = false;
  isOpenDODdp = false;
  CreditScoreDT=false;
  SIGNATURE: kyc_sig;
  PHOTO: kyc_sig;
  KYC: kyc_sig;
  ADDRESS: kyc_sig;
  kycSig = new kyc_sig();
  config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };

  // public onModifyClick(): void {
  //   this.validateControls();
  //   this.showMsg = null;
  //   this.isLoading = true;
  //   const cust = this.mapFormGrpToCustMaster();
  //   this.svc.addUpdDel<any>('UCIC/UpdateCustomerDtls', cust).subscribe(
  //     res => {
  //       if (null !== res && res > 0) {
  //         if (this.retrieveClicked) {
  //           // update this cust details in the list of existing cutomer
  //           // this will ensure, retrieve wont be needed every time
  //           UTCustomerProfileComponent.existingCustomers.push(cust);
  //           UTCustomerProfileComponent.existingCustomers.forEach(element => {
  //             if (element.cust_cd === cust.cust_cd) {
  //               element = cust;
  //             }
  //           });
  //         }
  //         this.HandleMessage(true, MessageType.Sucess,
  //           cust.cust_cd + ', Customer updated sucessfully');
  //       } else {
  //         this.HandleMessage(true, MessageType.Warning,
  //           cust.cust_cd + ', Could not update Customer');
  //       }
  //       this.isLoading = false;
  //     },
  //     err => { this.isLoading = false; }
  //   );
  // }
  disableImageSave = true;
  fileTypes = ['jpg', 'jpeg', 'png'];
  errMessage = '';
  relStatus:any;
  noPreview:any=''
  ngOnInit(): void {
    this.noPreview='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2OTApLCBxdWFsaXR5ID0gODIK/9sAQwAGBAQFBAQGBQUFBgYGBwkOCQkICAkSDQ0KDhUSFhYVEhQUFxohHBcYHxkUFB0nHR8iIyUlJRYcKSwoJCshJCUk/9sAQwEGBgYJCAkRCQkRJBgUGCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQk/8AAEQgB9AH0AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+jqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKMUUUAFFFFABRRRQAYooooAKKPxooAKWkooAKWkpaACiikoAWiikoAWiikoAWikpaACkoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaKSigAooooAWikooAWkoooAKWkooAWkoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaSlpKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaSlpKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaSlpKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaSiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAA8UA59K5zxF4iW3DWdq2ZTw7j+H2+tcoJpuplfJ/2jQB6dR+FeZefL/z1f/vo0edL/wA9X/76NAHptFeZedL/AM9X/wC+jR58v/PV/wDvo0Aem/hRXmXnS/8APWT/AL6NHny/89X/AO+jQB6b+FJnmvM/Ol/56v8A99Grel6vcaXciQM0iHhkJzkf40AehUVBZXsOoW6zwOGU/mD6Gp6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArnfEXiL7KGtLRgZejv/d9vrR4i8RfZ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qKKADFFFFABjFFFFABRj2oooAMc0UUUAFFFFABj2ooooAKKKKACiiigAooooAKKKKAAUUCigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooABRQKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAFFAooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAAUUCigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooABRRRQAUUUfhQAtJRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUfjRRQAUUtJQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFLSUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFH4UUfjQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFLRRQAUlFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFGKKKACjFFFABRRRQAYooooAMUUUUAFGKKKACjFFFABRRRQAYooooAMUUUUAFGKKKACjFFFABRRRQAYooooAKKKKACiiigAooooAKKKKADpRRRQB/9k='
    this.showNW=true;
    this.getAccountTypeList();
    this.operation = 'New';
    this.svc.getlbr(environment.relUrl,null).subscribe(data => {
      this.relStatus=data;
    })
    this.svc.getlbr(environment.relUrl, null).subscribe(data => {
      console.log(data)
      this.lbr_status = data
      debugger
    })
    // form defination
    this.custMstrFrm = this.frmBldr.group({
      brn_cd: [''],
      cust_cd: [{ value: '', disabled: true }],
      cust_type: ['', Validators.required],
      title: [''],
      first_name: [null, Validators.required],
      middle_name: [null],
      last_name: [null, Validators.required],
      cust_name: ['', { disabled: true }],
      guardian_name: [null],
      father_name: [null, Validators.required],
      cust_dt: [null],
      old_cust_cd: [null],
      dt_of_birth: [null, Validators.required],
      age: [{ value: null, disabled: true }],
      sex: [null, Validators.required],
      marital_status: [null],
      catg_cd: [null, Validators.required],
      community: [null, Validators.required],
      caste: [null, Validators.required],
      permanent_address: [null],
      ward_no: [null],
      state: [21, { disabled: true }],
      dist: [this.sys.dist_cd],
      pin: [null, [Validators.maxLength(6)]],
      vill_cd: [null, Validators.required],
      vill_name: [null, Validators.required],
      block_cd: [null, { disabled: true }, Validators.required],
      block_cd_desc: [null, { disabled: true }],
      service_area_cd: [null, { disabled: true }, Validators.required],
      service_area_cd_desc: [null, { disabled: true }],
      occupation: [null],
      phone: [null, [Validators.pattern('[0-9 ]{12}'), Validators.maxLength(12), Validators.required]],
      present_address: [null, Validators.required],
      farmer_type: [null],
      lbr: [null],
      is_weaker: [''],
      email: [''],
      monthly_income: [''],
      date_of_death: [null],
      sms_flag: [''],
      status: [{ value: 'A' }],
      pan: [''],
      nominee: [''],
      nom_relation: [''],
      kyc_photo_type: [''],
      kyc_photo_no: [''],
      kyc_address_type: [''],
      kyc_address_no: [''],
      org_status: [''],
      org_reg_no: [''],
      nationality: [null, Validators.required],
      email_id: [''],
      aadhar: ['', Validators.required],
      pan_status: [{ value: 'P' }, Validators.required],
      credit_agency: [''],
      credit_score: [null],
      credit_score_dt: [''],
      approve_status: [''],
      approve_by: [''],
      approve_dt: [''],
      office_address:['']
      
    });
    
    setTimeout(() => {
      this.getTitleMaster();
      this.getCategoryMaster();
      this.getStateMaster();
      this.getDistMaster();
      this.getVillageMaster();
      this.getKYCTypMaster();
      this.getBlockMster();
      this.onClearClick();
      this.getServiceAreaMaster();
      // this.onRetrieveClick();
      this.f.status.setValue('A');
      // this.f.state.disable()
      this.sys.ardbCD=='26'?this.f.dist.setValue(20):this.sys.dist_cd//set Purba Burdwan dist
      this.f.pan_status.setValue('P');
      this.f.nationality.setValue('INDIAN');
      // this.f.dist.disable()
    }, 150);
    
  }
  convertToJpg(file: File): Promise<{ jpgDataUrl: string, fileName: string }> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        context?.drawImage(img, 0, 0);

        // Convert the canvas content to JPG format
        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Output as JPG (JPEG data)
        
        // Generate the file name with .jpg extension
        const fileName = file.name.split('.').slice(0, -1).join('.') + '.jpg';

        resolve({ jpgDataUrl, fileName });
      };

      img.onerror = (error) => {
        reject('Error loading image: ' + error);
      };
    };

    reader.onerror = (error) => {
      reject('Error reading file: ' + error);
    };

    reader.readAsDataURL(file);
  });
}
getImage(_custCD: number) {
  this.isLoading = true;
  this.kycSig.ardb_cd = localStorage.getItem('__ardb_cd');
  this.kycSig.cust_cd = _custCD;//this.selectedVm.tm_deposit.cust_cd;
  this.kycSig.img_typ = 'SIGNATURE';//'SIGNATURE';
  this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
    res => {
      ;
      this.isLoading = false;
      if (null !== res && null !== res.img_cont) {
        res.img_cont='data:image/jpeg;base64,' + res.img_cont;
        this.SIGNATURE=res
        // this.SIGNATURE.img_cont = 'data:image/jpeg;base64,' + res.img_cont;
      }
      else{
        this.SIGNATURE.img_cont=this.noPreview
      }
    },
    err => {
      ;
      this.isLoading = false;
      this.HandleMessage(true, MessageType.Error, err.error.text);
    }
  );
  this.isLoading = true;
  this.kycSig.img_typ = 'PHOTO';//'SIGNATURE';
  this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
    res => {
      this.isLoading = false;
      if (res?.img_cont) {
        res.img_cont='data:image/jpeg;base64,' + res.img_cont;
        this.PHOTO=res;
        // this.PHOTO.img_cont = 'data:image/jpeg;base64,' + res.img_cont;
      } else {
        this.PHOTO.img_cont = this.noPreview;
      }
    },
    err => {
      this.isLoading = false;
      console.error('Error fetching image:', err);
      this.HandleMessage(true, MessageType.Error, err?.error?.text || 'Failed to load image');
    }
   
  );
  this.isLoading = true;
  this.kycSig.img_typ = 'ADDRESS';//'SIGNATURE';
  this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
    res => {
      ;
      this.isLoading = false;
      if (null !== res && null !== res.img_cont) {
        res.img_cont='data:image/jpeg;base64,' + res.img_cont;
        this.ADDRESS=res;
      // this.ADDRESS.img_cont = 'data:image/jpeg;base64,' + res.img_cont;
      }
      else{
        this.ADDRESS.img_cont=this.noPreview
      }
    },
    err => {
      ;
      this.isLoading = false;
      this.HandleMessage(true, MessageType.Error, err.error.text);
    }
  );
  this.isLoading = true;
  this.kycSig.img_typ = 'KYC';//'SIGNATURE';
  this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
    res => {
      ;
      this.isLoading = false;
      if (null !== res && null !== res.img_cont) {
        res.img_cont='data:image/jpeg;base64,' + res.img_cont;
        this.KYC=res;
      // this.KYC.img_cont = 'data:image/jpeg;base64,' + res.img_cont;
      }
      else{
        this.KYC.img_cont=this.noPreview
      }
    },
    err => {
      ;
      this.isLoading = false;
      this.HandleMessage(true, MessageType.Error, err.error.text);
    }
  );
}
  
  getAccountTypeList() {
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  openModal2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-xl'});
  }
  openUploadModal(template: TemplateRef<any>) {
    this.sucessMsgs = [];
    this.PHOTO = null;
    this.KYC = null;
    this.ADDRESS = null;
    this.SIGNATURE = null;
    this.getImage(this.f.cust_cd.value)
    this.modalRef = this.modalService.show(template, this.config);
  }

  private getTitleMaster(): void {
    this.svc.addUpdDel<mm_title[]>('Mst/GetTitleMaster', null).subscribe(
      res => {
        this.titles = res;
      
      },
      err => { }
    );
  }

  private getCategoryMaster(): void {
    this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        console.log(this.categories)
        this.categories = res;
      },
      err => { }
    );
  }

  private getStateMaster(): void {
    this.svc.addUpdDel<mm_state[]>('Mst/GetStateMaster', null).subscribe(
      res => {
        this.states = res;
      },
      err => { }
    );
  }

  private getDistMaster(): void {
    this.svc.addUpdDel<mm_dist[]>('Mst/GetDistMaster', null).subscribe(
      res => {
        this.districts = res;
      },
      err => { }
    );
  }

  private getVillageMaster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetVillageMaster', dt).subscribe(
      res => {
        console.log(res)
        this.villages = res;
        debugger
        this.villages.sort((a,b) => (a.vill_name > b.vill_name) ? 1 : ((b.vill_name > a.vill_name) ? -1 : 0))
      },
      err => { }
    );
  }

  onVillageChnage(vill_cd: any,s_area_cd:any,b_cd:any): void {
    console.log(vill_cd,s_area_cd,b_cd);
    console.log(this.villages);
    
    // add logic to select block and area.
    const selectedVillage = this.villages.filter(e => e.vill_cd == vill_cd && e.service_area_cd==s_area_cd && e.block_cd==b_cd)[0];
    this.selectedBlock = this.blocks.filter(e => e.block_cd == b_cd)[0];
    this.selectedServiceArea = this.serviceAreas.filter(e => e.service_area_cd == s_area_cd)[0];
      
    this.custMstrFrm.patchValue({
      vill_cd:selectedVillage.vill_cd,
      vill_name:selectedVillage.vill_name,
      service_area_cd: this.selectedServiceArea.service_area_cd,
      service_area_cd_desc: this.selectedServiceArea.service_area_name,
      block_cd: this.selectedBlock.block_cd,
      block_cd_desc: this.selectedBlock.block_name
    });
    this.showHideVill=false;
  }

  private getBlockMster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    // this.svc.addUpdDel<mm_block[]>('Mst/GetBlockMaster', this.sys.ardbCD).subscribe(
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        console.log(res)
        this.blocks = res;
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      },
      err => { }
    );
  }
  onshow(i:any)
  {
    if(i.target.value==''){
      this.showHideVill=false
    }
    else{
      this.villages1=this.villages.filter(e=>e.vill_name.toLowerCase().includes(i.target.value.toLowerCase())==true)
      this.showHideVill=true
    }
    debugger
    }
  getGuardian(){
    this.custMstrFrm.controls.guardian_name.setValue(this.custMstrFrm.controls.father_name.value);
    this.custMstrFrm.controls.lbr.setValue('Father');
  }
  private getServiceAreaMaster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    // this.svc.addUpdDel<mm_service_area[]>('Mst/GetServiceAreaMaster', dt).subscribe(
    this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
      res => {
        console.log(res)
        this.serviceAreas = res;
      },
      err => { }
    );
  }

  private getKYCTypMaster(): void {
    this.svc.addUpdDel<mm_kyc[]>('Mst/GetKycMaster', null).subscribe(
      res => {
        console.log(this.KYCTypes)
        this.KYCTypes = res;
      },
      err => { }
    );
  }

  public onNameChange(): void {
    
    const cust_name = (this.f.first_name.value) + ' '
      + ((this.f.middle_name.value == null) ? '' : (this.f.middle_name.value + ' '))
      + ((this.f.last_name.value==null)?'':(this.f.last_name.value));
     debugger
    this.custMstrFrm.patchValue({
      cust_name: cust_name
    });
    debugger
  }

  public onRetrieveClick(): void {
    // this.custName.unsubscribe()
  

    // this.ngAfterViewInit()
    
   

    this.onClearClick();
    this.custMstrFrm.disable();
    this.f.cust_name.enable();
    this.retrieveClicked = true;
    this.selectedClick=false;
   this.custMstrFrm.controls.catg_cd.enable();
    
    // if (loadingReq) {

    // }
    // if (undefined !== UTCustomerProfileComponent.existingCustomers &&
    //   null !== UTCustomerProfileComponent.existingCustomers &&
    //   UTCustomerProfileComponent.existingCustomers.length > 0) {
    // } else {
    //   // this.cust_name.nativeElement.focus();
    //   if (loadingReq) { this.isLoading = true; }
    //   const cust = new mm_customer(); cust.cust_cd = 0;
    //   this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
    //     res => {
    //       UTCustomerProfileComponent.existingCustomers = res;
    //       if (loadingReq) { this.isLoading = false; }
    //     },
    //     err => { this.isLoading = false; }
    //   );
    // }
  }

  // public suggestCustomer(): void {
  //   this.suggestedCustomer = UTCustomerProfileComponent.existingCustomers
  //     .filter(c => c.cust_name.toLowerCase().startsWith(this.f.cust_name.value.toLowerCase())
  //       || c.cust_cd.toString().startsWith(this.f.cust_name.value)
  //       || (c.phone !== null && c.phone.startsWith(this.f.cust_name.value)))
  //     .slice(0, 20);
  // }
  onChangeName(){
    this.suggestedCustomer = null;
    this.showNoResult=false
    if (this.f.cust_name.value.length > 0) {
      this.disabledOnNull=false
    }
    else{
      this.disabledOnNull=true
    }
  }
  public suggestCustomer(): Observable<mm_customer> {
    this.f.status.disable();
    this.isLoading=true;
    console.log(this.f.cust_name.value)
    console.log(!this.selectedClick+" "+this.retrieveClicked)
    // console.log(this.f.cust_name.value.length)
    if (this.f.cust_name.value != null && !this.selectedClick && this.retrieveClicked) {
     
      if (this.f.cust_name.value.length > 0) {
        const prm = new p_gen_param();
        prm.as_cust_name = this.f.cust_name.value.toLowerCase();
        prm.ardb_cd = this.sys.ardbCD;
        this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
          res => {
            console.log(res)
            this.isLoading=false;
            if (undefined !== res && null !== res && res.length > 0) {
              this.suggestedCustomer = res
              this.showNoResult=false
              return res
            } else {
              this.suggestedCustomer = [];
              this.showNoResult=true;
              return [];
            }
          },
          err => { this.isLoading = false; }
        );
      } else {

        this.suggestedCustomer = null;
        // this.suggestedCustomer.length=0
        // this.suggestedCustomer=[];
        return null;
      }
    }
    return null

  }
  hide() {
    // this.suggestedCustomer.length=0;
  }
  // ngAfterViewInit() {
    
  //   this.f.cust_name.valueChanges.pipe(
      
  //     debounceTime(500),
  //     distinctUntilChanged(),
  //     switchMap(res => this.suggestCustomer())
  //   ).subscribe(res => {
  //     // console.log(res);

  //   })
  // }

  public onDobChange(value: Date): number {
    // ;
    if (null !== value) {
      const timeDiff = Math.abs(Date.now() - value?.getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25)
      this.f.age.setValue(age);
      this.f.catg_cd.setValue(age>60?3:null)
      age>60?this.f.catg_cd.disable():this.f.catg_cd.enable()
      return age;
    }
  }

  public onPininput(event: any): void {
    if (isNaN(event.target.value)) {
      this.f.pin.setValue('');
    }
  }
  setPerAdd(add:any){
    this.custMstrFrm.controls.permanent_address.setValue(add.target.value);
  }
  public SelectCustomer(cust: mm_customer): void {
    // this.f.status.disable();
    // ;
    // var dt_Death = Utils.convertDtToString(cust.date_of_death);
    // console.log(dt_Death)
    const dob = (null !== cust.dt_of_birth && '01/01/0001 00:00' === cust.dt_of_birth.toString()) ? null
      : cust.dt_of_birth;
    this.selectedCustomer = cust;
    this.msg.sendcustomerCodeForKyc(this.selectedCustomer.cust_cd);
    this.onClearClick();
   this.selectedClick=true
   if(this.selectedCustomer.cust_cd){
    this.reportData2.length=0;
    this.reportData3.length=0;
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "cust_cd":this.selectedCustomer.cust_cd
    }
  
    this.isLoading=true
    this.svc.addUpdDel('UCIC/GetLoanDtls',dt).subscribe(data=>{console.log(data)
      this.reportData2=data
      this.svc.addUpdDel('UCIC/GetDepositDtls',dt).subscribe(data=>{console.log(data)
        this.reportData3=data
        this.isLoading=false
      })
    })
  }
  debugger
    // this.custName.unsubscribe()
    this.enableModifyAndDel = true;
    this.suggestedCustomer = null;
    this.organizationMode=cust.cust_type=='O'?true:false;
    this.selectedBlock = this.blocks.filter(e => e.block_cd === cust.block_cd)[0];
    this.selectedServiceArea = this.serviceAreas.filter(e => (e.service_area_cd === cust.service_area_cd && e.block_cd === cust.block_cd))[0];
    this.custMstrFrm.patchValue({
      brn_cd: cust.brn_cd,
      cust_cd: cust.cust_cd,
      cust_type: cust.cust_type,
      title: cust.title,
      first_name: cust.first_name,
      middle_name: cust.middle_name,
      last_name: cust.last_name,
      cust_name: cust.cust_name,
      guardian_name: cust.guardian_name,
      cust_dt: cust.cust_dt,
      old_cust_cd: cust.old_cust_cd,
      dt_of_birth: dob, // formatDate(new Date(cust.dt_of_birth), 'yyyy-MM-dd', 'en'),
      // age: cust.age,
      sex: cust.sex,
      marital_status: cust.marital_status,
      catg_cd: cust.catg_cd,
      community: cust.community,
      caste: cust.caste,
      permanent_address: cust.permanent_address,
      ward_no: cust.ward_no,
      state: cust.state,
      dist: cust.dist,
      pin: cust.pin,
      vill_cd: cust.vill_cd,
      // vill_name: cust.vill_cd?this.villages.filter(e => (e.vill_cd == cust.vill_cd)&&(e.block_cd == cust.block_cd)&&(e.service_area_cd === cust.service_area_cd))[0].vill_name:'',
      vill_name: cust.vill_cd?this.villages?.filter(e => (e.vill_cd == cust.vill_cd&& e.service_area_cd == cust.service_area_cd))[0]?.vill_name:'',
      block_cd: cust.block_cd,
      block_cd_desc: this.selectedBlock!=undefined ? this.selectedBlock.block_name:'',
      service_area_cd: cust.service_area_cd,
      service_area_cd_desc: this.selectedServiceArea!=undefined ? this.selectedServiceArea.service_area_name:'',
      occupation: cust.occupation,
      phone: cust.phone,
      present_address: cust.present_address,
      office_address: cust.office_address,
      farmer_type: cust.farmer_type,
      email: cust.email,
      monthly_income: cust.monthly_income,
      date_of_death: (null !== cust.date_of_death && '01/01/0001 00:00' === cust.date_of_death.toString()) ? null
        : cust.date_of_death,
      sms_flag: cust.sms_flag == 'Y' ? cust.sms_flag : null,
      // sms_flag: cust.sms_flag,
      lbr: cust.lbr_status,
      is_weaker: cust.is_weaker == 'Y' ? cust.is_weaker : null,
      // is_weaker:cust.is_weaker,
      status: cust.status,
      pan: cust.pan,
      nominee: cust.nominee,
      nom_relation: cust.nom_relation,
      kyc_photo_type: cust.kyc_photo_type,
      kyc_photo_no: cust.kyc_photo_no,
      kyc_address_type: cust.kyc_address_type,
      kyc_address_no: cust.kyc_address_no,
      org_status: cust.org_status,
      org_reg_no: cust.org_reg_no,
      father_name : cust.father_name,
      nationality:cust.nationality,
      email_id:cust.email_id,
      aadhar:cust.aadhar,
      pan_status:cust.pan_status,
      credit_agency:cust.credit_agency,
      credit_score:cust.credit_score==0?null:cust.credit_score,
      credit_score_dt:(null !== cust.credit_score_dt && '01/01/0001 00:00' === cust.credit_score_dt.toString()) ? null
      : cust.credit_score_dt,
    });
    console.log(cust.vill_cd);
    console.log(this.villages?.filter(e => e.vill_cd == cust.vill_cd)[0]?.vill_name);
    console.log(this.villages);
    
    debugger
    this.retrieveClicked = false
    // this.f.state.disable();
    // this.f.dist.disable()
  }

  public onSaveClick(): void {
    if (!this.validateControls()) { return; }
    this.isLoading = true;
    const cust = this.mapFormGrpToCustMaster();
    let newCustomer = false;
    cust.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    cust.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    if (cust.cust_cd === 0) {
      newCustomer = true;
    }

    if (newCustomer) {
      console.log('s');
      if(this.custMstrFrm.controls.phone.value){
        cust.del_flag = 'N'
      console.log(cust)
      this.svc.addUpdDel<any>('UCIC/InsertCustomerDtls', cust).subscribe(
        res => {
          this.isLoading = false;
          if ((+res) > 0) {
            this.custMstrFrm.patchValue({
              cust_cd: res
            });
            cust.cust_cd = res;
            this.selectedCustomer = cust;
            UTCustomerProfileComponent.existingCustomers.push(cust);
            this.HandleMessage(true, MessageType.Sucess,
              cust.cust_cd + ', Customer created sucessfully');
            this.msg.sendcustomerCodeForKyc(cust.cust_cd);
          } else {
            this.HandleMessage(true, MessageType.Error,
              'Got ' + cust.cust_cd + 'customer code, Customer creation failed');
          }
        },
        err => { this.isLoading = false; }
      );
      }
      else{
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Warning,'Could not create Customer, phone number is mendetory' );
        document.getElementById('phone').focus();
      }
      
    }
    else {

      // cust.modified_by = this.sys.UserId;
      cust.ardb_cd = this.selectedCustomer.ardb_cd;
      console.log(cust)
      
      this.svc.addUpdDel<any>('UCIC/UpdateCustomerDtls', cust).subscribe(
        res => {
          if (null !== res && res > 0) {
            if (undefined !== UTCustomerProfileComponent.existingCustomers ||
              null !== UTCustomerProfileComponent.existingCustomers ||
              UTCustomerProfileComponent.existingCustomers.length > 0) {
              const pos = UTCustomerProfileComponent.existingCustomers
                .findIndex(e => e.cust_cd === cust.cust_cd);
              if (pos >= 0) {
                UTCustomerProfileComponent.existingCustomers.splice(pos, 1);
                UTCustomerProfileComponent.existingCustomers.push(cust);
              }

            } else {
              UTCustomerProfileComponent.existingCustomers.push(cust);
            }
            this.HandleMessage(true, MessageType.Sucess,
              cust.cust_cd + ', Customer updated sucessfully');
            this.msg.sendcustomerCodeForKyc(cust.cust_cd);
          } else {
            this.HandleMessage(true, MessageType.Warning,
              cust.cust_cd + ', Could not update Customer, response recieved ' + res);
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );

    }
  }


  validateControls(): boolean {
    debugger
    this.showMsgs = [];
    let trReturn = true;
    if(this.organizationMode){
      if(this.retrieveClicked==true && this.f.cust_name.value==null){
        this.HandleMessage(true,MessageType.Error,'Empty search field')
      }
      if (null !== this.f.phone.value && this.f.phone.value.length > 0) {
        if (!Utils.ValidatePhone(this.f.phone.value)) {
          this.HandleMessage(true, MessageType.Error, 'Phone number is not valid');
          trReturn = false;
        }
      } else {
        if(!this.retrieveClicked)
        this.HandleMessage(true, MessageType.Error, 'Phone number is mandatory');
        trReturn = false;
      }
      for (const name in this.custMstrFrm.controls) {
        debugger
        if (this.custMstrFrm.controls[name].invalid) {
          debugger
          switch (name) {
            
            case 'cust_type':
              this.HandleMessage(true, MessageType.Error, 'Customer Type is Mandatory');
              break;
            case 'first_name':
              this.HandleMessage(true, MessageType.Error, 'First Name is Mandatory');
              break;
            case 'last_name':
              this.HandleMessage(true, MessageType.Error, 'Last Name is Mandatory');
              break;
            
            case ' catg_cd':
              this.HandleMessage(true, MessageType.Error, 'Category of customer is Mandatory');
              break;
            case 'community':
              this.HandleMessage(true, MessageType.Error, 'Community of customer is Mandatory');
              break;
            case 'caste':
              this.HandleMessage(true, MessageType.Error, 'Caste of customer is Mandatory');
              break;
              case 'guardian_name':
                this.HandleMessage(true, MessageType.Error, 'Guardian\'s Name is Mandatory');
                break;
            case 'block_cd':
              this.HandleMessage(true, MessageType.Error, 'Block of customer Mandatory');
              break;
            case 'service_area_cd':
              this.HandleMessage(true, MessageType.Error, 'Service are of customer is Mandatory');
              break;
            // case 'phone':
            //   this.HandleMessage(true, MessageType.Error, 'Phone number is mandatory in correct format');
            //   break;
            case 'present_address':
              this.HandleMessage(true, MessageType.Error, 'present address is Mandatory');
              break;
          }
        }
      }
      if(this.custMstrFrm.controls.catg_cd.value==null){
        debugger
        this.HandleMessage(true, MessageType.Error, 'Category of customer is Mandatory');
        trReturn = true;
      }
    }
    else{
      if (null !== this.f.pan.value && this.f.pan.value.length > 0) {
        if (!Utils.ValidatePAN(this.f.pan.value)) {
          this.HandleMessage(true, MessageType.Error, 'PAN is not valid');
          trReturn = false;
        }
      }
      if(this.f.kyc_photo_type.value == 'P' || this.f.kyc_photo_type.value == 'G'){
  
        this.f.kyc_photo_type.value == 'P' && this.f.kyc_photo_no.value.length != 10 ? 
        this.HandleMessage(true,MessageType.Error,'Pan No is Invalid') : 
        this.f.kyc_photo_type.value == 'G' && this.f.kyc_photo_no.value.length != 12 ? 
        this.HandleMessage(true,MessageType.Error,'Adhar No is Invalid') : '';
  
        trReturn =  this.f.kyc_photo_type.value == 'P' && this.f.kyc_photo_no.value.length != 10 ?  
        false : this.f.kyc_photo_type.value == 'G' && this.f.kyc_photo_no.value.length != 12 ? 
        false: true;  
      }
      if(this.f.kyc_address_type.value == 'P' || this.f.kyc_address_type.value == 'G'){
        this.f.kyc_address_type.value == 'P' && this.f.kyc_address_no.value.length != 10 ? 
        this.HandleMessage(true,MessageType.Error,'Pan No is Invalid') : 
        this.f.kyc_address_type.value == 'G' && this.f.kyc_address_no.value.length != 12 ? 
        this.HandleMessage(true,MessageType.Error,'Adhar No is Invalid') : '';
  
  
        trReturn =   this.f.kyc_address_type.value == 'P' && this.f.kyc_address_no.value.length != 10 ?  
        false : this.f.kyc_address_type.value == 'G' && this.f.kyc_address_no.value.length != 12 ? 
        false: true;  
      }
      // // ;
      if(this.retrieveClicked==true && this.f.cust_name.value==null){
        this.HandleMessage(true,MessageType.Error,'Empty search field')
      }
      if (null !== this.f.phone.value && this.f.phone.value.length > 0) {
        if (!Utils.ValidatePhone(this.f.phone.value)) {
          this.HandleMessage(true, MessageType.Error, 'Phone number is not valid');
          trReturn = false;
        }
      } else {
        if(!this.retrieveClicked)
        this.HandleMessage(true, MessageType.Error, 'Phone number is mandatory');
        trReturn = false;
      }
  debugger
      for (const name in this.custMstrFrm.controls) {
        debugger
        if (this.custMstrFrm.controls[name].invalid) {
          debugger
          switch (name) {
            case 'dt_of_birth':
              this.HandleMessage(true, MessageType.Error, 'Date of Birth is Mandatory');
              break;
            case 'cust_type':
              this.HandleMessage(true, MessageType.Error, 'Customer Type is Mandatory');
              break;
            case 'first_name':
              this.HandleMessage(true, MessageType.Error, 'First Name is Mandatory');
              break;
            case 'last_name':
              this.HandleMessage(true, MessageType.Error, 'Last Name is Mandatory');
              break;
            case 'guardian_name':
              this.HandleMessage(true, MessageType.Error, 'Guardian\'s Name is Mandatory');
              break;
            case 'sex':
              this.HandleMessage(true, MessageType.Error, 'Sex of customer is Mandatory');
              break;
            case ' catg_cd':
              this.HandleMessage(true, MessageType.Error, 'Category of customer is Mandatory');
              break;
            case 'community':
              this.HandleMessage(true, MessageType.Error, 'Community of customer is Mandatory');
              break;
            case 'caste':
              this.HandleMessage(true, MessageType.Error, 'Caste of customer is Mandatory');
              break;
            case 'block_cd':
              this.HandleMessage(true, MessageType.Error, 'Block of customer Mandatory');
              break;
            case 'service_area_cd':
              this.HandleMessage(true, MessageType.Error, 'Service are of customer is Mandatory');
              break;
            // case 'phone':
            //   this.HandleMessage(true, MessageType.Error, 'Phone number is mandatory in correct format');
            //   break;
            case 'present_address':
              this.HandleMessage(true, MessageType.Error, 'present address is Mandatory');
              break;
          }
        }
      }
      if(this.custMstrFrm.controls.catg_cd.value==null){
        debugger
        this.HandleMessage(true, MessageType.Error, 'Category of customer is Mandatory');
        trReturn = true;
      }
      
      if (this.showMsgs.length > 0) {
        trReturn = false;
      }
    }
   console.log(trReturn)
    return trReturn;
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    const showMsg = new ShowMessage();
    showMsg.Show = show;
    showMsg.Type = type;
    showMsg.Message = message;
    this.showMsgs.push(showMsg);
  }
  public RemoveMessage(rmMsg: ShowMessage) {
    rmMsg.Show = false;
    this.showMsgs.splice(this.showMsgs.indexOf(rmMsg), 1);
  }

  public onDelClick(): void {
    // delete the selected customer
    this.isLoading = true;
    // const cust = this.mapFormGrpToCustMaster();
    console.log(this.selectedCustomer)
    this.svc.addUpdDel<any>('UCIC/DeleteCustomerDtls', this.selectedCustomer).subscribe(
      res => {
        this.isLoading = false;
        if (this.retrieveClicked) {
          //ardb_cd, modified_by
          // delete this cust details from the list of existing cutomer
          // this will ensure, retrieve wont be needed every time
          UTCustomerProfileComponent.existingCustomers =
            UTCustomerProfileComponent.existingCustomers.filter(o => o.cust_cd !== this.selectedCustomer.cust_cd);
        }
        this.HandleMessage(true, MessageType.Sucess,
          this.selectedCustomer.cust_cd + ', Customer Deleted sucessfully')
      },
      err => { this.isLoading = false; }
    );
  }

  public onClearClick(): void {
    // this.custName.unsubscribe()
   this.selectedClick=true
   this.disabledOnNull=true;
   this.retrieveClicked=false
    this.custMstrFrm.reset();
    this.showMsgs = [];
    this.showNoResult=false;
    this.enableModifyAndDel = false;
   
    this.custMstrFrm.enable();
    this.f.cust_cd.disable();
    this.f.cust_name.disable();
    // this.f.service_area_cd.disable();
    // this.f.service_area_cd_desc.disable();
    // this.f.block_cd.disable();
    // this.f.block_cd_desc.disable();
    // this.f.dt_of_birth.disable();
    this.f.age.disable();
    // this.f.date_of_death.disable();
    this.suggestedCustomer = null;
    this.f.status.setValue('A');
    // this.f.cust_name.setValue('')
    this.f.status.disable()
    this.f.state.setValue(21);
    // this.f.state.disable()
    this.f.dist.setValue(this.sys.dist_cd);
    this.f.pan_status.setValue('P');
    this.f.nationality.setValue('INDIAN');
    // this.f.dist.disable()
  }

  mapFormGrpToCustMaster(): mm_customer {
    const cust = new mm_customer();
    try {
      cust.brn_cd = this.sys.BranchCode; // '101';
      cust.cust_cd = (null === this.f.cust_cd.value || '' === this.f.cust_cd.value)
        ? 0 : +this.f.cust_cd.value;
      cust.cust_type = this.f.cust_type.value;
      cust.title = this.f.title.value;
      cust.first_name = this.f.first_name.value?.toUpperCase();
      cust.middle_name = this.f.middle_name.value === null ? '' : this.f.middle_name.value?.toUpperCase();
      cust.last_name = this.f.last_name.value?.toUpperCase();
      cust.cust_name = this.f.cust_name.value?.toUpperCase();
      cust.guardian_name = this.f.guardian_name.value?.toUpperCase();
      // cust.cust_dt = ('' === this.f.cust_dt.value
      //   || '0001-01-01T00:00:00' === this.f.cust_dt.value) ? null : this.f.cust_dt.value;
      cust.cust_dt = this.sys.CurrentDate;
      cust.old_cust_cd = this.f.old_cust_cd.value;
      cust.dt_of_birth = this.f.dt_of_birth.value;
      cust.age = this.f.age.value==null?0:this.f.age.value;
      cust.sex = this.f.sex.value;
      cust.marital_status = this.f.marital_status.value;
      cust.catg_cd = +this.f.catg_cd.value;
      cust.community = +this.f.community.value;
      cust.caste = +this.f.caste.value;
      cust.permanent_address = this.f.permanent_address.value;
      cust.ward_no = +this.f.ward_no.value;
      cust.state = this.f.state.value;
      cust.dist = this.f.dist.value;
      cust.pin = +this.f.pin.value;
      cust.vill_cd = this.f.vill_cd.value?this.f.vill_cd.value:0;
      // during modification if village is not changed then block code & service area code
      // needs to be taken from selected customer
      cust.block_cd = this.f.block_cd.value;
      // cust.service_area_cd = (undefined === this.selectedServiceArea) ?
      //   this.selectedCustomer.service_area_cd : this.selectedServiceArea.service_area_cd;
      cust.occupation = this.f.occupation.value;
      cust.phone = this.f.phone.value;
      cust.present_address = this.f.present_address.value;
      cust.office_address = this.f.office_address.value;
      cust.farmer_type = this.f.farmer_type.value;
      cust.lbr_status = this.f.lbr.value;
      cust.email = this.f.email.value;
      cust.monthly_income = +this.f.monthly_income.value;
      cust.date_of_death = ('' === this.f.date_of_death.value
        || '0001-01-01T00:00:00' === this.f.date_of_death.value)
        ? null : this.f.date_of_death.value;
      cust.sms_flag = this.f.sms_flag.value ? 'Y' : 'N';
      cust.is_weaker = this.f.is_weaker.value ? 'Y' : 'N';
      cust.status = this.f.date_of_death.value == '0001-01-01T00:00:00' || this.f.date_of_death.value ? 'D' : this.f.status.value;
      cust.pan = this.f.pan.value;
      cust.nominee = this.f.nominee.value;
      cust.nom_relation = this.f.nom_relation.value;
      cust.kyc_photo_type = this.f.kyc_photo_type.value;
      cust.kyc_photo_no = this.f.kyc_photo_no.value;
      cust.kyc_address_type = this.f.kyc_address_type.value; // as per defect fix
      cust.kyc_address_no = this.f.kyc_address_no.value;
      cust.org_status = this.f.org_status.value;
      cust.org_reg_no = +this.f.org_reg_no.value;
      cust.ardb_cd = this.sys.ardbCD;
      
      cust.father_name = this.f.father_name.value?this.f.father_name.value?.toUpperCase():this.f.father_name.value;
      cust.nationality=this.f.nationality.value?.toUpperCase();
      cust.email_id=this.f.email_id.value;
      cust.aadhar=this.f.aadhar.value;
      cust.pan_status=this.f.pan_status.value;
      cust.credit_agency=this.f.credit_agency.value;
      cust.credit_score=this.f.credit_score.value?this.f.credit_score.value:0;
      cust.credit_score_dt=this.f.credit_score_dt.value;
      cust.approval_status= "U";
      cust.approved_by=null;
      cust.approved_dt=null;
      // cust.modified_dt = new Date();
      // cust.created_dt = cust.created_dt?cust.created_dt : new Date();



      // debugger;
      // cust.time_stamp=new Date().toLocaleTimeString();
    } catch (error) {
      console.error(error);
      this.HandleMessage(true, MessageType.Warning, error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }

    return cust;
  }
  private updateImageProperty(imgType: string, img: kyc_sig) {
    console.log(img);
    
    switch (imgType) {
      case 'PHOTO':
        this.PHOTO = img;
        break;
      case 'SIGNATURE':
        this.SIGNATURE = img;
        break;
      case 'ADDRESS':
        this.ADDRESS = img;
        break;
      case 'KYC':
        this.KYC = img;
        break;
    }
    this.disableImageSave = false;
  }
  handleFileInput(files: FileList, imgType: string) {
    this.errMessage = '';
    this.sucessMsgs = [];
    this.fileToUpload = files.item(0);
  
    if (!this.fileToUpload) return;
  
    const name = this.fileToUpload.name;
    const size = this.fileToUpload.size;
    const extension = name.split('.').pop().toLowerCase();
  
    // Validate file type
    if (!['jpg', 'jpeg', 'png'].includes(extension)) {
      alert('Only JPG, JPEG or PNG images are allowed.');
      return;
    }
  
    // Validate file size
    if (size / (1024 * 1024) > 1) {
      this.errMessage = 'File size should be less than 1MB.';
      return;
    }
  
    // Read file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        // Set canvas dimensions to match the image
        canvas.width = image.width;
        canvas.height = image.height;
        context?.drawImage(image, 0, 0);
  
        // Convert to JPG format
        const imgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
  
        const img = new kyc_sig();
        img.ardb_cd = this.sys.ardbCD;
        img.cust_cd = this.selectedCustomer.cust_cd;
        img.img_cont = imgDataUrl; // Base64 string
        img.img_typ = imgType;
        img.created_by = `${this.sys.UserId}/${localStorage.getItem('ipAddress')}`;
  
        // Update the respective property
        this.updateImageProperty(imgType, img);
      };
    };
  
    reader.readAsDataURL(this.fileToUpload);
  }
  
  onSaveImgClick(): void {
   this.isLoading=true;
    if (this.PHOTO !== undefined && this.PHOTO !== null && this.PHOTO?.img_cont?.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.PHOTO).subscribe(
        res => {
          this.isLoading=false;
          this.sucessMsgs.push('Picture uploaded sucessfully!!');
          this.PHOTO = null;
        },
        err => {
          this.isLoading=false;
          console.log("server error") }
      );
    }
    if (this.SIGNATURE !== undefined && this.SIGNATURE !== null && this.SIGNATURE?.img_cont?.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.SIGNATURE).subscribe(
        res => {
          this.isLoading=false;
          this.sucessMsgs.push('Signature uploaded sucessfully!!');
          this.SIGNATURE = null;
        },
        err => { 
          this.isLoading=false;}
      );
    }
    if (this.KYC !== undefined && this.KYC !== null && this.KYC?.img_cont?.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.KYC).subscribe(
        res => {
          this.isLoading=false;
          this.sucessMsgs.push('Customer Kyc uploaded sucessfully!!');
          this.KYC = null;
        },
        err => {
          this.isLoading=false; }
      );
    }
    if (this.ADDRESS !== undefined && this.ADDRESS !== null && this.ADDRESS?.img_cont?.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.ADDRESS).subscribe(
        res => {
          this.isLoading=false;
          this.sucessMsgs.push('Address uploaded sucessfully!!');
          this.ADDRESS = null;
        },
        err => {
          this.isLoading=false; }
      );
    }
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  changeDt() {
    console.log(this.f.date_of_death.value)
    this.isOpenDODdp = !this.isOpenDODdp
    // this.custMstrFrm.patchValue({
    //   status: (this.f.date_of_death.value!='0001-01-01T00:00:00'||this.f.date_of_death.value!=null || this.f.date_of_death.value!='') ? 'D':'A'
    // })
  }
  changeCreditDt() {
    console.log(this.f.credit_score_dt.value)
    this.CreditScoreDT = !this.CreditScoreDT
    // this.custMstrFrm.patchValue({
    //   status: (this.f.date_of_death.value!='0001-01-01T00:00:00'||this.f.date_of_death.value!=null || this.f.date_of_death.value!='') ? 'D':'A'
    // })
  }

  @HostListener('document:click', ['$event'])
  onClickEvent(event: MouseEvent) {
    if (this.suggestedCustomer != null) {
      this.suggestedCustomer = null;
    }
  }
  onDodChange(e: any) {
    console.log(e)
    this.custMstrFrm.patchValue({
      status: e == '0001-01-01T00:00:00' || e == null ? 'A' : 'D'
    })
  }
  setNull(_flag){
    this.custMstrFrm.patchValue({
      kyc_photo_no:_flag == 'PIN' ? '' : this.f.kyc_photo_no.value,
      kyc_address_no:_flag == 'AIN' ? '' : this.f.kyc_address_no.value

    })
  }
  noSpecialChars(e,_flag){
    if(_flag == 'AIN' && this.f.kyc_address_type.value == 'G'){
      if(Utils.preventAlphabet(e.target.value,e.key))
          e.preventDefault();
     }
     else if(_flag == 'PIN' && this.f.kyc_photo_type.value=='G'){
      if(Utils.preventAlphabet(e.target.value,e.key))
      e.preventDefault();
     }
  }
  CheckExistance(_flag){
    if(_flag == 'PIN'){
      if(this.f.kyc_photo_type.value == 'P' || this.f.kyc_photo_type.value == 'G'){
        this.isLoading = true;
        this.chkPanexistance(this.f.kyc_photo_type.value == 'P' ? 'UCIC/Checkpancard' : 'UCIC/Checkaadharcard',this.f.kyc_photo_type.value,_flag);
        }
    }
  else if(_flag == 'PAN'){
    this.isLoading = true;
    this.chkPanAadhar('UCIC/Checkpancard',_flag);
    
    }
    else if(_flag == 'AAD'){
      this.isLoading = true;
      this.chkPanAadhar('UCIC/Checkaadharcard',_flag);
      
      }  

  else {
       if(this.f.kyc_address_type.value == 'P' || this.f.kyc_address_type.value == 'G'){
                this.isLoading = true;
                 this.chkPanexistance(this.f.kyc_address_type.value == 'P' ?'UCIC/Checkpancard' : 'UCIC/Checkaadharcard',this.f.kyc_address_type.value,_flag);
        }
      }
  }
  chkPanexistance(_flag,_type,_mode){
    var dt = {
         'ardb_cd':this.sys.ardbCD,
         'cust_cd': this.f.cust_cd.value?this.f.cust_cd.value:1,
         'kyc_photo_no': this.f.kyc_photo_no.value,
         'kyc_photo_type':this.f.kyc_photo_type.value,
         'kyc_address_type':this.f.kyc_address_type.value,
         'kyc_address_no':this.f.kyc_address_no.value
    }
    this.svc.addUpdDel<any>(_flag, dt).subscribe(
      res => {
                console.log(res);
                this.isLoading = false;
                if(res > 0){
                      this.showMsgs.length = 0;
                    //  _mode == 'PIN' ? this.kycPhotoNo.nativeElement.focus() : this.kycAddressNo.nativeElement.focus()
                     this.HandleMessage(true, MessageType.Error, _type == 'P' ? `This pan card number is already exist for another customer, UCIC is ${res}}` 
                     :`This Aadhar number is already exist for another customerUCIC is ${res}`);  
                     this._isDisabled= true;              
                }      
                else{
                  this.showMsgs.length = 0;
                  this._isDisabled= false;              
                }  
      } 
    )
      


  }
  chkPanAadhar(API_URL,_FLAG){
    var pan = {
         'ardb_cd':this.sys.ardbCD,
         'cust_cd': this.f.cust_cd.value?this.f.cust_cd.value:1,
         'kyc_photo_no': this.f.kyc_photo_no.value,
         'kyc_photo_type':this.f.kyc_photo_type.value,
         'kyc_address_type':this.f.kyc_address_type.value,
         'kyc_address_no':this.f.kyc_address_no.value,
         'pan':this.f.pan.value
    }
    var aadhar = {
      'ardb_cd':this.sys.ardbCD,
      'cust_cd': this.f.cust_cd.value?this.f.cust_cd.value:1,
      'kyc_photo_no': this.f.kyc_photo_no.value,
      'kyc_photo_type':this.f.kyc_photo_type.value,
      'kyc_address_type':this.f.kyc_address_type.value,
      'kyc_address_no':this.f.kyc_address_no.value,
      'aadhar':this.f.aadhar.value
 }
    this.svc.addUpdDel<any>(API_URL, _FLAG == 'PAN'?pan:aadhar).subscribe(
      res => {
                console.log(res);
                this.isLoading = false;
                if(res > 0){
                      this.showMsgs.length = 0;
                      // _FLAG == 'PAN' ? this.pan.nativeElement.focus() : this.aadhar.nativeElement.focus()
                     this.HandleMessage(true, MessageType.Error, _FLAG == 'PAN' ? `This pan card number is already exist for another customer, UCIC is ${res}`
                     :`This Aadhar number is already exist for another customer, UCIC is ${res}`);  
                     this._isDisabled= true;
                     if(_FLAG == 'PAN')  {
                      this.f.pan.setValue('');
                     }
                     else{
                      this.f.aadhar.setValue('');
                     }            
                }      
                else{
                  if(_FLAG == 'PAN'){
                    this.f.kyc_photo_type.setValue('P');
                    this.f.kyc_photo_no.setValue(this.f.pan.value);
                  }
                  if(_FLAG == 'AAD'){
                    this.f.kyc_address_type.setValue('G');
                    this.f.kyc_address_no.setValue(this.f.aadhar.value);
                  }
                  this.showMsgs.length = 0;
                  this._isDisabled= false;              
                }  
      } 
    )
      


  }
  changeCustType(event:any){
    console.log(event.target.value)
    if(event.target.value=='O'){
      this.organizationMode=true;
    }
    else{
      this.organizationMode=false;
    }
  }
}








