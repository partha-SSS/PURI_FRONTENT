
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'loading',
  template: `		<div id="pause" class="d-flex align-items-center justify-content-center">
									<!-- <div id="spinner"></div> -->
                  <!-- <div class="lds-ring"><div></div><div></div></div> -->
                  <div class="lds-ring">
                  <img src="./assets/images/landing.png" class="L"> <div></div><div></div><div></div><div></div></div>
								</div>`,
  styleUrls: ['loading.scss']
})

export class LoadingComponent {

}
