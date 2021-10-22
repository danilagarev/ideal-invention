import {SETUP_FILTERS} from "../../metaplex/src/constants";

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
