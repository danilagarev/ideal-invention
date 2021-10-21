import {SETUP_FILTERS} from "../../metaplex/src/constants";

export const MAX_NAME_LENGTH = 32;
export const MAX_SYMBOL_LENGTH = 10;
export const MAX_URI_LENGTH = 200;
export const MAX_CREATOR_LEN = 32 + 1 + 1;

export const settings = {
  commitment: "recent",
  cacheFunctions: {
    names: ["getProgramAccounts"],
    params: {
      getProgramAccounts: [
        "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98",
      ],
    },
    filters: {
      getProgramAccounts: {
        "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98": [
          SETUP_FILTERS
        ],
      },
    },
  },
};
