import { Injectable } from '@angular/core';
declare var MantraMFS110: any;
@Injectable({
  providedIn: 'root'
})
export class FingerprintAuthenticationService {

  constructor() { }

  captureFingerprint(): Promise<string> {
    return new Promise((resolve, reject) => {
      MantraMFS110.CaptureFinger((response: any) => {
        if (response.Status === 'Success') {
          resolve(response.TemplateData);
        } else {
          reject(new Error('Fingerprint capture failed'));
        }
      });
    });
  }

  verifyFingerprint(templateData: string): Promise<boolean> {
    return 
  }
}
