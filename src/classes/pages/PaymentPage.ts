import { PaymentCount } from "~/types/index.type";
import Common from "./Common";
import { CreditCardInformation } from "~/types/payment.type";

class PaymentPage extends Common {
  checkAvailableCreditCardType() {
    const paymentCount =
      window.$nuxt.$store.state.ols._indexPage.mobileDevice.productPaymentCount;

    return paymentCount === PaymentCount.PC1 ? "product" : "monthly";
  }

  getAvailableCreditCardExpire(creditCardType: string): CreditCardInformation {
    const expirationYearSelector = `#${creditCardType}-payment-credit-card-expiration-year`;
    const expirationMonthSelector = `#${creditCardType}-payment-credit-card-expiration-month`;

    const expireYear = this.selector(expirationYearSelector)
      ?.querySelector("option:nth-child(3)")
      ?.getAttribute("value") as string;
    const expireMonth = this.selector(expirationMonthSelector)
      ?.querySelector("option:nth-child(3)")
      ?.getAttribute("value") as string;

    return {
      expireYear,
      expireMonth,
    };
  }

  async fillCreditCardInformation(
    creditCardInformation: CreditCardInformation = {
      creditCardNumber: "4111111111111111",
      expireYear: "40",
      expireMonth: "07",
      securityCode: "432",
    },
  ) {
    const { creditCardNumber, expireYear, expireMonth, securityCode } =
      creditCardInformation;

    const creditCardType = this.checkAvailableCreditCardType();

    const {
      expireYear: expirationYearAvailableValue,
      expireMonth: expirationMonthAvailableValue,
    } = this.getAvailableCreditCardExpire(creditCardType);

    await this.fillField(
      `#${creditCardType}-payment-credit-card-number`,
      creditCardNumber as string,
    );
    await this.select(
      `#${creditCardType}-payment-credit-card-expiration-year`,
      (creditCardInformation.expireMonth
        ? expirationYearAvailableValue
        : expireYear) as string,
    );
    await this.waitTime(0.1);
    await this.select(
      `#${creditCardType}-payment-credit-card-expiration-month`,
      (
        (creditCardInformation.expireMonth
          ? expirationMonthAvailableValue
          : expireMonth) as string
      ).padStart(2, "0"),
    );

    await this.fillField(
      `#${creditCardType}-payment-credit-card-security-code`,
      securityCode as string,
    );
  }
}

export default PaymentPage;
