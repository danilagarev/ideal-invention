import {Connection} from "@solana/web3.js";
import {PublicKey} from "@solana/web3.js";
import bs58 from "bs58";
import {Buffer} from "buffer";
import {programs} from "@metaplex/js";

const {metaplex: {MetaplexKey}} = programs;

export const SOLANA_RPC = process.env.SOLANA_RPC_ENDPOINT || "https://api.devnet.solana.com";

export const connection = new Connection(SOLANA_RPC, 'confirmed');
export const STORE_ID = new PublicKey(process.env.STORE_ADDRESS ||
  "8DLNU7o4dN3VtNPQsFkUEg89oSaXazQkMDG8ufQtzFQN");
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