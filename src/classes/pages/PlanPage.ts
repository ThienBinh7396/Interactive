import { Contract, PaymentCount, Plan } from "~/types/index.type";
import Common from "./Common";
import { SelectContractConfig } from "~/types/plan.type";

class PlanPage extends Common {
  async waitPlanPageComplete() {
    await this.waitFor(() => window.document.readyState === "complete", {
      timeout: 60,
      interval: 500,
    });
  }

  async fillRequiredFieldByContract(contract: Contract) {
    const isMnpCarrierAvailable = await this.waitForAvailable("#first-mnp-mno");

    if (!isMnpCarrierAvailable) {
      console.error("The carrier selector isn't available!");
    }

    await this.selectFirstElement("#first-mnp-mno");

    await this.fillField("#first-mnp-current-msn", "09000121211");

    await this.fillField(
      "#first-mnp-reservation-number",
      contract === "c02" ? "1100111111" : "1300111111",
    );

    await this.selectFirstElement("#first-mnp-expiration-date");
  }

  async selectContractById(
    contract: Contract,
    config: SelectContractConfig = {
      fillRequiredFieldByContract: true,
    },
  ) {
    if (contract !== Contract.C01) {
      this.clickTo("#first-keep-phone-number");
      await this.waitTime(0.2);
    }

    switch (contract) {
      case Contract.C01:
        this.clickTo("#first-contract-radio-01-label");
        break;
      case Contract.C02:
        this.clickTo("#first-contract-radio-04-label");
        if (config.fillRequiredFieldByContract) {
          await this.fillRequiredFieldByContract(contract);
        }
        break;
      case Contract.C03:
        this.clickTo("#first-contract-radio-03-label");
        break;
      case Contract.C06:
        this.clickTo("#first-contract-radio-02-label");
        break;
      case Contract.C13:
        this.clickTo("#first-contract-radio-05-label");
        break;
      case Contract.C90:
        this.clickTo("#first-contract-radio-06-label");
        if (config.fillRequiredFieldByContract) {
          await this.fillRequiredFieldByContract(contract);
        }
        break;
    }
  }

  selectPlanById(planId: Plan) {
    this.clickTo(`#first-plan-radio #first-${planId}`);
  }

  async selectPaymentCount(count: PaymentCount) {
    this.clickTo(`input[id^="payment-count-radio"][value="${count}"]`);
    this.selector(
      `input[id^="payment-count-radio"][value="${count}"]`,
    )?.dispatchEvent(new Event("change"));
  }

  toggleFamilyDiscount(forceChecked: boolean) {
    const isChecked = this.toInputElement("#family-discount")?.checked;

    if (forceChecked === undefined || forceChecked !== isChecked) {
      this.clickTo("#family-discount-label");
    }
  }
}

export default PlanPage;
