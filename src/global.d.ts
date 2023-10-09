/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    I: Interactive;
    Mock: MockApi;
    $nuxt: any;
  }
}
