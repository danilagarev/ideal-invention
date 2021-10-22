import {Connection} from "@metaplex/js";
import {PublicKey} from "@solana/web3.js";
import bs58 from "bs58";
import {Buffer} from "buffer";
import {programs} from "@metaplex/js";

const {metaplex: {MetaplexKey}} = programs;

export const connection = new Connection("https://api.devnet.solana.com");
export const STORE_ID = new PublicKey("8DLNU7o4dN3VtNPQsFkUEg89oSaXazQkMDG8ufQtzFQN");
export const SETUP_FILTERS = [
  {
    memcmp: {
      offset: 0,
      bytes: bs58.encode(Buffer.from([MetaplexKey.AuctionManagerV2])),
    },
  },
  // Filter for assigned to store
  {
    memcmp: {
      offset: 1,
      bytes: new PublicKey(STORE_ID).toBase58(),
    },
  },
]