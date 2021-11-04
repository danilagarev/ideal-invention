import { getProgramAccounts } from "./solana_utils/getProgramAccounts";
import { settings } from "../../rpc-cache-utils/src/config";
import {
  AuctionManagerModel,
  AuctionReserveManagerModel,
  TokenSwapModel, TokenSwapReserveModel
} from "../../mongo/src/models";
import {dbSwitcher} from "../../mongo/src/switcher_utils";
import {AsyncTask, ToadScheduler, SimpleIntervalJob} from "toad-scheduler";

const callCorrespondingCachedMethod = async (
  name: string,
  param: any,
  filters: Array<any> | undefined,
  setWebSocket = false
): Promise<void> => {
  switch (name) {
    case "getProgramAccounts": {
      if (
        settings.cacheFunctions.params.getProgramAccounts.indexOf(param) >= 0
      ) {
        await getProgramAccounts(param, filters, setWebSocket);
      }
      break;
    }
    default:
      break;
  }
};

async function startWriting(
  firstSwitch: dbSwitcher,
  secondSwitch: dbSwitcher) {
  console.log("Refreshing database...");
  await firstSwitch.reserveTable.deleteMany();
  await secondSwitch.reserveTable.deleteMany();
  console.log("firstTableMain",firstSwitch.mainTable.modelName)
  console.log("firstTableReserve",firstSwitch.reserveTable.modelName)
  console.log("secondTableReserve",secondSwitch.mainTable.modelName)
  console.log("secondTableMain",secondSwitch.reserveTable.modelName)

  for (const name of settings.cacheFunctions.names) {
    const params = (settings.cacheFunctions.params as Record<string, any>)[
      name
      ];
    const filterByName = (settings.cacheFunctions.filters as Record<any, any>)[
      name
      ];
    if (!params) {
      await callCorrespondingCachedMethod(name, undefined, undefined, true);
    } else {
      console.log(
        `Populating cache with method: ${name} for params: ${params}`
      );
      for (const mainParam of params) {
        let filters: Array<any> = [];
        if (filterByName) {
          filters = filterByName[mainParam];
        }
        await callCorrespondingCachedMethod(name, mainParam, filters, true);
      }
    }
  }
  console.log("Finished Populating cache");
}

(async () => {
  const scheduler = new ToadScheduler()
  // TODO: fix hardcode, find better solution.
  console.log("Initialize database...");
  const AuctionManagerSwitch = new dbSwitcher({
    mainTable: AuctionManagerModel,
    reserveTable: AuctionReserveManagerModel,
    serviceName: 'auction'
  })
  const TokenSwapSwitch = new dbSwitcher({
    mainTable: TokenSwapModel,
    reserveTable: TokenSwapReserveModel,
    serviceName: 'tokenSwap'
  })

  await TokenSwapSwitch.init();
  await AuctionManagerSwitch.init();

  const task = new AsyncTask(
    'Switching database',
    () => { return startWriting(AuctionManagerSwitch, TokenSwapSwitch)
      .then(async () => {
        await TokenSwapSwitch.switchTable();
        await AuctionManagerSwitch.switchTable();
      }) },
    (err: Error) => { console.log(err)}
  )
  const job = new SimpleIntervalJob({
    minutes: 2,
    runImmediately: true
  }, task)

  scheduler.addSimpleIntervalJob(job)
})();
