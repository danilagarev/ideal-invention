import {SETUP_FILTERS} from "../../metaplex/src/constants";
import {POOL_FILTERS, TOKEN_SWAP_PROGRAM_ID} from "./constants";

export const settings = {
  commitment: "recent",
  cacheFunctions: {
    names: ["getProgramAccounts"],
    params: {
      getProgramAccounts: [
        TOKEN_SWAP_PROGRAM_ID,
        "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98",
      ],
    },
    filters: {
      getProgramAccounts: {
        [TOKEN_SWAP_PROGRAM_ID]: [
          POOL_FILTERS
        ],
        "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98": [
          SETUP_FILTERS
        ],
      },
    },
  },
};
