import InputPage from "~/classes/pages/InputPage";
import OptionsPage from "~/classes/pages/OptionsPage";
import PlanPage from "~/classes/pages/PlanPage";
import UploadPage from "~/classes/pages/UploadPage";
import PaymentPage from "~/classes/pages/PaymentPage";
import AgreementPage from "~/classes/pages/AgreementPage";
import CompanySalePage from "~/classes/pages/CompanySalePage";

import { Mixin } from "ts-mixer";

export default Mixin(
  PlanPage,
  OptionsPage,
  UploadPage,
  InputPage,
  PaymentPage,
  AgreementPage,
  CompanySalePage,
);
