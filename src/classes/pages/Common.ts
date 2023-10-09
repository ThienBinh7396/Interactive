import Action from "~/classes/action/Action";
import {
  CharacterBirthdayConfig,
  CharacterNameConfig,
} from "~/types/action.type";
import { Character, PageTitle } from "~/types/index.type";

class Common extends Action {
  toPrefixCharacter(character: Character) {
    return character === "contractor" ? character : `first-${character}`;
  }

  async uploadCharacterCertificateDocument(character: Character) {
    await this.uploadFile(
      `#${this.toPrefixCharacter(character)}-certificate-main-image1`,
    );
  }

  async fillCharacterName(
    character: Character,
    nameConfig?: CharacterNameConfig,
  ) {
    const firstNameKanji = nameConfig?.firstNameKanji || "契";
    const lastNameKanji = nameConfig?.lastNameKanji || "カナカナ";
    const firstNameKana = nameConfig?.firstNameKana || "カナ";
    const lastNameKana = nameConfig?.lastNameKana || "カナ";

    const prefixCharacter =
      character === "contractor" ? character : `first-${character}`;

    await this.fillField(`#${prefixCharacter}-last-name`, firstNameKanji);
    await this.fillField(`#${prefixCharacter}-first-name`, lastNameKanji);
    await this.fillField(`#${prefixCharacter}-last-name-kana`, firstNameKana);
    await this.fillField(`#${prefixCharacter}-first-name-kana`, lastNameKana);
  }

  selectCharacterGender(character: Character, isMale = true) {
    const prefixCharacter = this.toPrefixCharacter(character);

    const genderSelector = isMale
      ? `#${prefixCharacter}-gender-radio-01-label`
      : `${prefixCharacter}-gender-radio-02-label`;

    this.clickTo(genderSelector);
  }

  async fillCharacterBirthDay(
    character: Character,
    options?: CharacterBirthdayConfig,
  ) {
    const birthday = options?.birthday;
    const isAdult = options?.isAdult === undefined ? true : options?.isAdult;

    if (birthday) {
      await this.fillField(
        `#${this.toPrefixCharacter(character)}-birthday`,
        birthday,
      );
      return;
    }

    const characterBirthday = isAdult ? "19890131" : "20150131";
    await this.fillField(
      `#${this.toPrefixCharacter(character)}-birthday`,
      characterBirthday,
    );
  }

  async waitForPage(page: PageTitle) {
    let pageTitle = "";

    switch (page) {
      case PageTitle.OPTION:
        pageTitle = "オプション選択";
        break;

      case PageTitle.UPLOAD:
        pageTitle = "本人確認";
        break;

      case PageTitle.INPUT:
        pageTitle = "お客さま情報入力";
        break;

      case PageTitle.PAYMENT:
        pageTitle = "お支払い情報";
        break;
    }

    await this.waitFor(() => {
      const allH1Nodes = this.selectorAll("h1");
      return allH1Nodes.some((node) => node.textContent?.includes(pageTitle));
    });

    await this.waitTime(1);
  }

  async nextPage(page: PageTitle) {
    const nextButtonSelector = this.getNextButtonSelector(page);

    await this.waitForClickable(nextButtonSelector);
    this.clickTo(nextButtonSelector);
  }

  async scrollToNextPageButton(page: PageTitle) {
    this.selector(this.getNextButtonSelector(page))?.scrollIntoView();
  }

  getNextButtonSelector(page: PageTitle) {
    let nextButtonSelector = "";
    switch (page) {
      case PageTitle.PLAN:
        nextButtonSelector = "#plan-next-button";
        break;

      case PageTitle.OPTION:
        nextButtonSelector = "#option-next-button";
        break;

      case PageTitle.UPLOAD:
        nextButtonSelector = "#upload-next-button";
        break;

      case PageTitle.INPUT:
        nextButtonSelector = "#input-next-button";
        break;

      case PageTitle.PAYMENT:
        nextButtonSelector = "#payment-next-button";
        break;

      case PageTitle.AGREEMENT:
        nextButtonSelector = "#agreements-next-button";
        break;

      case PageTitle.ADDITION:
        nextButtonSelector = "#upload-next-button";
        break;
    }

    return nextButtonSelector;
  }
}

export default Common;
