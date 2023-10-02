import Interactive from "~/classes/interactive/Interactive";
import MockApi from "~/classes/mocks/MockApi";

console.log("Start Interactive. Running in the MAIN world...");

window.I = new Interactive();
window.Mock = MockApi;
