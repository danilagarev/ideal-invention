import { PublicKey } from "@solana/web3.js";
import {
  connection,
} from "../../../rpc-cache-utils/src/connection";
import * as util from "util";
import {addAuctions, addAuction} from "../../../common/src/auction";
import {SETUP_FILTERS, SOLANA_RPC} from "../../../metaplex/src/constants";
import {TOKEN_SWAP_PROGRAM_ID} from "../../../rpc-cache-utils/src/constants";
import {saveAllTokenSwap} from "../../../mongo/src/crud/tokenSwap";
import {dbSwitcher} from "../../../mongo/src/switcher_utils";

const webSocketsIds: Map<string, number> = new Map();

export const getProgramAccounts = async (
  programID: string,
  filters: Array<any> | undefined,
  setWebSocket = false,
  auctionSwitcher: dbSwitcher,
  tokenSwapSwitcher: dbSwitcher
): Promise<void> => {
  const lfilters = filters || [[]];
  for (const filter of lfilters) {
    console.log(
      `Fetching: getProgramAccounts of ${programID} with filters: ${util.inspect(
        filter
      )}`
    );
    if (programID === TOKEN_SWAP_PROGRAM_ID && SOLANA_RPC === "https://api.devnet.solana.com") {
      console.log("Pools not supported for devnet")
      return
    }
    const resp = await connection.getProgramAccounts(new PublicKey(programID), {filters: filter});
    if (programID === TOKEN_SWAP_PROGRAM_ID) {
      await tokenSwapSwitcher.switchWriteTable();
      await saveAllTokenSwap(resp, programID);
      await tokenSwapSwitcher.switchReadTable();
    } else {
      await auctionSwitcher.switchWriteTable();
      await setMongoAccounts(resp);
      await auctionSwitcher.switchReadTable();
    }
  }

  if (setWebSocket) {
    const prevSubId = webSocketsIds.get(programID);
    if (prevSubId) {
      console.log(
        `removing listener Websocket for: onProgramAccountChange of ${programID}`
      );
      await connection.removeProgramAccountChangeListener(prevSubId);
    }
    console.log(
      `Creating Websocket for: onProgramAccountChange of ${programID}`
    );
    if (programID !== TOKEN_SWAP_PROGRAM_ID) {
      const subId = connection.onProgramAccountChange(
        new PublicKey(programID),
        async (info) => {
          const pubkey = info.accountId.toBase58();
          await addAuction(pubkey)
        },
        "recent",
        SETUP_FILTERS
      );
      webSocketsIds.set(programID, subId);
    }
  }
};

const setMongoAccounts = async (
  accounts: any
) => {
  const accPubkeys = accounts.map((acc: any)=> acc.pubkey);
  await addAuctions(accPubkeys)
};
