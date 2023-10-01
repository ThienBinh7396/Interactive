import Common from "./Common";

class UploadPage extends Common {
  selectContractorAddress(isMatchAddress: boolean) {
    if (isMatchAddress) {
      this.clickTo("#contractor-address-confirm-radio-01");
      return;
    }

    this.clickTo("#contractor-address-confirm-radio-02");
  }
}

export default UploadPage;
