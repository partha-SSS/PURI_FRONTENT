


export default class Utils {
  static regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  static regMobile = new RegExp('(?:(?:\\+|0{0,2})91(\\s*[\\- ]\\s*)?|[0 ]?)?[789]\\d{9}|(\\d[ -]?){10}\\d', 'g');

  public static convertStringToDt(str: string): Date {
    str = str.substring(0, 10);
    const dateParts = str.split('/');
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  }

  public static ChkArrNotEmpty(arrToChk: any): boolean {
    return (undefined !== arrToChk && null !== arrToChk && arrToChk.length > 0);
  }

  public static ChkArrNotEmptyRetrnEmptyArr(arrToChk: any): any {
    if (undefined !== arrToChk && null !== arrToChk && arrToChk.length > 0) {
      return arrToChk;
    } else {
      return [];
    }
  }

  /** Use this method to get todays dt and put in textbox */
  public static getTodaysDtInCorrectFormat(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    return (((dd < 10) ? ('0' + dd) : dd) + '/'
      + ((mm < 10) ? '0' + mm : mm) + '/'
      + yyyy);
  }

  public static convertDtToString(tmpDate: Date): string {
    const mm = tmpDate.getMonth() + 1; // getMonth() is zero-based
    const dd = tmpDate.getDate();
    return (dd > 9 ? '' : '0') + dd + '/'
      + (mm > 9 ? '' : '0') + mm
      + '/' + tmpDate.getFullYear();
  }

  public static ValidatePAN(pan: string): boolean {
    if (this.regpan.test(pan)) { // valid pan card number
      return true;
    } else {
      return false; // invalid pan card number
    }
  }

  public static ValidatePhone(phone: string): boolean {
    // if (this.regMobile.test(phone)) { // valid Phone
    //   return true;
    // } else {
    //   return false; // invalid phone
    // }
    if (phone.length >= 10 && phone.length <= 12) { // valid Phone
      return true;
    } else {
      return false; // invalid phone
    }
  }

  // private static some() {
  //   let today = new Date();
  //   let dd = today.getDate();

  //   let mm = today.getMonth() + 1;
  //   const yyyy = today.getFullYear();
  //   if (dd < 10) {
  //     dd = '0' + dd;
  //   }

  //   if (mm < 10) {
  //     mm = '0' + mm;
  //   }
  //   today = mm + '-' + dd + '-' + yyyy;
  //   console.log(today);
  //   today = mm + '/' + dd + '/' + yyyy;
  //   console.log(today);
  //   today = dd + '-' + mm + '-' + yyyy;
  //   console.log(today);
  //   today = dd + '/' + mm + '/' + yyyy;
  //   console.log(today);
  // }


  public static preventAlphabet(Adhar,eventKey){
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(eventKey) === -1){
      return true;
    }
    return false;

  }
}
