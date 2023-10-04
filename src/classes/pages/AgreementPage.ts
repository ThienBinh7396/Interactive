import { PageTitle } from "~/types/index.type";
import Common from "./Common";

class AgreementPage extends Common {
  async agreeAgreement(clickToNextPage = false) {
    const serviceNoteButton = this.findElementByText("重要説明事項を確認する");

    if (serviceNoteButton && serviceNoteButton instanceof HTMLElement) {
      serviceNoteButton.click();
    } else {
      console.error("Cannot find the service notes agreement ");
    }

    const isTelecomPrivacyAvailable = await this.waitForClickable(
      "label[for='telecom-privacy-agreement-checkbox']",
    );

    if (isTelecomPrivacyAvailable) {
      this.clickTo("label[for='telecom-privacy-agreement-checkbox']");
    }

    if (this.checkElementExist("#first-show-filtering-agreement")) {
      this.clickTo("#first-show-filtering-agreement");

      const isFilteringAgreementAvailable = await this.waitForClickable(
        "label[for='first-filtering-agreement-checkbox']",
      );

      if (isFilteringAgreementAvailable) {
        this.clickTo("label[for='first-filtering-agreement-checkbox']");
      }
    }

    this.clickTo("label[for='agreement-kappu-checkbox']");
    this.clickTo("label[for='agreement-business-law-checkbox']");

    if (clickToNextPage) {
      await this.nextPage(PageTitle.AGREEMENT);
    }
  }
}

export default AgreementPage;
