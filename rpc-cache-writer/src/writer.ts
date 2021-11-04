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
  setWebSocket = false,
  auctionSwitcher: dbSwitcher,
  tokenSwapSwitcher: dbSwitcher
): Promise<void> => {
  switch (name) {
    case "getProgramAccounts": {
      if (
        settings.cacheFunctions.params.getProgramAccounts.indexOf(param) >= 0
      ) {
        await getProgramAccounts(
          param,
          filters,
          setWebSocket,
          auctionSwitcher,
          tokenSwapSwitcher
        );
      }
      break;
    }
    default:
      break;
  }
};

async function startWriting(
  auctionSwitcher: dbSwitcher,
  tokenSwapSwitcher: dbSwitcher) {
  console.log("Refreshing database...");
  await auctionSwitcher.reserveTable.deleteMany();
  await tokenSwapSwitcher.reserveTable.deleteMany();
  console.log("firstTableMain", auctionSwitcher.mainTable.modelName)
  console.log("firstTableReserve", auctionSwitcher.reserveTable.modelName)
  console.log("secondTableMain", tokenSwapSwitcher.mainTable.modelName)
  console.log("secondTableReserve", tokenSwapSwitcher.reserveTable.modelName)

  for (const name of settings.cacheFunctions.names) {
    const params = (settings.cacheFunctions.params as Record<string, any>)[
      name
      ];
    const filterByName = (settings.cacheFunctions.filters as Record<any, any>)[
      name
      ];
    if (!params) {
      await callCorrespondingCachedMethod(
        name,
        undefined,
        undefined,
        true,
        auctionSwitcher,
        tokenSwapSwitcher
      );
    } else {
      console.log(
        `Populating cache with method: ${name} for params: ${params}`
      );
      for (const mainParam of params) {
        let filters: Array<any> = [];
        if (filterByName) {
          filters = filterByName[mainParam];
        }
        await callCorrespondingCachedMethod(
          name,
          mainParam,
          filters,
          true,
          auctionSwitcher,
          tokenSwapSwitcher
          );
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
        console.log("Started writing")
      }) },
    (err: Error) => { console.log(err)}
  )
  const job = new SimpleIntervalJob({
    minutes: 2,
    runImmediately: true
  }, task)

  scheduler.addSimpleIntervalJob(job)
})();
