import {mongoDBClient} from "./connection";


export async function addAccount(collectionName: string,
                                         dbName: string,
                                         filter: any, account: any): Promise<any> {
  try{
    await mongoDBClient.connect();

    const db = mongoDBClient.db(dbName);
    const collection = db.collection(collectionName);
    const updateDocument = {
      $push: { "accounts": account }
    }
    await collection.findOneAndUpdate(filter, updateDocument, {}, async () => {await mongoDBClient.close()});
    console.log("Here!");
  } catch (e) {
    console.log(e)
  }

}

export async function getOne(collectionName: string,
                                         dbName: string,
                                         filter: {programId: string}): Promise<any> {

  try {
    await mongoDBClient.connect();

    const db = mongoDBClient.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOne(filter);
    console.log("Here!")
    await mongoDBClient.close()
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function insertRow(collectionName: string,
                                         dbName: string,
                                         doc: any): Promise<any> {
  try {
    await mongoDBClient.connect();

    const db = mongoDBClient.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne(doc, {}, async () => {await mongoDBClient.close()});
  } catch (e) {
    console.log(e)
  }
}