import { Character } from "~/types/index.type";
import Common from "./Common";

class InputPage extends Common {
  async fillContractorPrimaryPhoneNumber(phoneNumber = "09010231311") {
    await this.fillField("#primary-phone-number", phoneNumber);
    await this.waitTime(0.05);
    this.selector("#primary-phone-number")?.dispatchEvent(new Event("blur"));
  }

  async fillContractorZipCode(zipCode = "1000000") {
    await this.fillField("#zip-code", zipCode, true);

    await this.waitTime(2);

    const isZipCodeAvailable = await this.waitFor(() => {
      return this.selectorAll("#address option").length >= 2;
    });

    if (!isZipCodeAvailable) {
      console.error(`The ${zipCode} zipCode is unavailable.`);
      return;
    }

    const addressSelectNode = this.selector("#address") as HTMLSelectElement;

    addressSelectNode.value =
      (
        this.selector("#address option:nth-child(2)") as HTMLOptionElement
      ).getAttribute("value") || "";
    addressSelectNode.dispatchEvent(new Event("change"));

    await this.fillField("#incidental-address", "１０ー１　ビル");
  }

  async fillContractorEmail() {
    await this.fillField("#email", "daichi.nomura@g.softbank.co.jp");

    this.clickTo("#email-send-agreement");
  }

  async fillUserFamily(isUserAdult = true) {
    this.clickTo("#first-user-identity-radio-02");

    await this.waitTime(1);

    await this.fillCharacterName(Character.USER);
    this.selectCharacterGender(Character.USER);
    await this.fillCharacterBirthDay(Character.USER, { isAdult: isUserAdult });
    await this.fillField("#first-user-network-pass-code", "4321");
  }
}

export default InputPage;
