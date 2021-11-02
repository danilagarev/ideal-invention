import {SETUP_FILTERS} from "../../metaplex/src/constants";
import {POOL_FILTERS, TOKEN_SWAP_PROGRAM_ID} from "./constants";

export const settings = {
  commitment: "recent",
  cacheFunctions: {
    names: ["getProgramAccounts"],
    params: {
      getProgramAccounts: [
        // "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98",
        TOKEN_SWAP_PROGRAM_ID,
      ],
    },
    filters: {
      getProgramAccounts: {
        // "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98": [
        //   SETUP_FILTERS
        // ],
        "SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8": [
          POOL_FILTERS
        ],
      },
    },
  },
};
