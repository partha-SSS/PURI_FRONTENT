import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IfscService {

  private baseUrl: string = 'https://ifsc.razorpay.com';

  constructor(private http: HttpClient) {}

  // Method to fetch IFSC code details
  getIfscDetails(ifscCode: string): Observable<any> {
    const url = `${this.baseUrl}/${ifscCode}`;
    return this.http.get(url);
  }
}