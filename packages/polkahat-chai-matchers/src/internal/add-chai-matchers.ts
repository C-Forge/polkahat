import { use } from "chai";
import chaiAsPromised from "chai-as-promised";

import "../types";
import { polkahatChaiMatchers } from "./polkahatChaiMatchers";

use(polkahatChaiMatchers);
use(chaiAsPromised);
