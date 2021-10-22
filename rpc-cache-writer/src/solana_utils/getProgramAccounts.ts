import { PublicKey } from "@solana/web3.js";
import {
  connection,
} from "../../../rpc-cache-utils/src/connection";
import {
  settings
} from "../../../rpc-cache-utils/src/config";
import * as util from "util";
import {addAuction} from "../../../common/src/auction";
import {SETUP_FILTERS} from "../../../metaplex/src/constants";

const webSocketsIds: Map<string, number> = new Map();

export const getProgramAccounts = async (
  programID: string,
  filters: Array<any> | undefined,
  setWebSocket = false
): Promise<void> => {
  const lfilters = filters || [[]];
  for (const filter of lfilters) {
    console.log(
      `Fetching: getProgramAccounts of ${programID} with filters: ${util.inspect(
        filter
      )}`
    );

    const resp = await (connection as any)._rpcRequest("getProgramAccounts", [
      programID,
      { commitment: settings.commitment, encoding: "base64", filters: filter },
    ]);
    await setMongoAccounts(resp.result, programID);
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
};

const setMongoAccounts = async (
  accounts: any,
  programID: string
) => {
  const accPromises = accounts.map((acc: any)=> {
    const pubkey = acc.pubkey;
    console.log(`saving in cache ${pubkey} of ${programID}`)
    return addAuction(pubkey)
  })
  await Promise.all(accPromises)
};
