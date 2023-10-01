import InputPage from "~/classes/pages/InputPage";
import OptionsPage from "~/classes/pages/OptionsPage";
import PlanPage from "~/classes/pages/PlanPage";
import UploadPage from "~/classes/pages/UploadPage";

import { Mixin } from "ts-mixer";

export default Mixin(PlanPage, OptionsPage, UploadPage, InputPage);
