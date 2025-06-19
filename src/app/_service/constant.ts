import { Injectable } from '@angular/core';

@Injectable()
export class Constant {
  // public server = 'http://213.175.201.219/plesk-site-preview/patkai.svc.worldlegaldocs.com/';
  public server = 'https://localhost:5001/'; // DEV
  public apiUrl = 'api/';
  public serverWithApiUrl = this.server + this.apiUrl;
}
