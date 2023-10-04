import Common from "./Common";
import { CreditCardInformation } from "~/types/payment.type";

class PaymentPage extends Common {
  async fillMonthlyCreditCardInformation(
    creditCardInformation: CreditCardInformation = {
      creditCardNumber: "4111111111111111",
      expireYear: "40",
      expireMonth: "07",
      securityCode: "432",
    },
  ) {
    const { creditCardNumber, expireYear, expireMonth, securityCode } =
      creditCardInformation;

    await this.fillField(
      "#monthly-payment-credit-card-number",
      creditCardNumber,
    );
    await this.select(
      "#monthly-payment-credit-card-expiration-year",
      expireYear
    );
    await this.waitTime(0.1);
    await this.select(
      "#monthly-payment-credit-card-expiration-month",
      expireMonth.padStart(2, "0")
    );

    await this.fillField(
      "#monthly-payment-credit-card-security-code",
      securityCode,
    );
  }
}

export default PaymentPage;
