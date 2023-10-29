import Common from "./Common";

class CompanySalePage extends Common {
  async goToSyainPlanPage() {
    const allAnswersNodes = this.selectorAll("#area_input table tbody tr td:nth-child(2) .formradio-inline-item:first-child input[name*='answer_']")

    allAnswersNodes.forEach(node => this.clickTo(node as HTMLElement));

    this.clickTo('#button_confirm');
    await this.waitForAvailable('#button_submit');
    this.clickTo('#button_submit');
  }
}

export default CompanySalePage;
