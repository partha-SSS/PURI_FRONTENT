/// <reference lib="webworker" />
// declare const CaptureFinger: (quality: number, timeout: number) => any;
// declare const GetTemplate: (tmpFormat: string) => any;
// import CaptureFinger from '../../../../assets/sdk/morfinauth';
importScripts('/assets/sdk/jquery-1.8.2.js');
importScripts('/assets/sdk/morfinauth.js');
addEventListener('message', ({ data }) => {
  // console.log(JSON.parse(data))
  // const parseDt = JSON.parse(data);
  // const captureResult = (self as any).CaptureFinger(parseDt?.quality, parseDt?.timeout);
  // console.log(captureResult);
  const response = `worker response to`;
  postMessage(response);
});



