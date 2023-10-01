import { Contract, PaymentCount, Plan } from "~/types/index.type";
import Common from "./Common";

class PlanPage extends Common {
  selectContractById(contract: Contract) {
    if (contract !== Contract.C01) {
      this.clickTo("#first-keep-phone-number");
    }

    switch (contract) {
      case Contract.C01:
        this.clickTo("#first-contract-radio-01-label");
        break;
      case Contract.C02:
        this.clickTo("#first-contract-radio-04");
        break;
      case Contract.C03:
        this.clickTo("#first-contract-radio-03");
        break;
      case Contract.C06:
        this.clickTo("#first-contract-radio-02");
        break;
      case Contract.C13:
        this.clickTo("#first-contract-radio-05");
        break;
      case Contract.C90:
        this.clickTo("#first-contract-radio-06");
        break;
    }
  }

  selectPlanById(planId: Plan) {
    this.clickTo(`#first-plan-radio #first-${planId}`);
  }

  selectPaymentCount(count: PaymentCount) {
    this.clickTo(`input[id^=payment-count-radio][value=${count}]`);
  }

  toggleFamilyDiscount(forceChecked: boolean) {
    const isChecked = this.toInputElement("#family-discount")?.checked;

    if (forceChecked === undefined || forceChecked !== isChecked) {
      this.clickTo("#family-discount");
    }
  }
}

export default PlanPage;
