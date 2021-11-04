import type {Model} from "mongoose";
import {SwitcherModel} from "../models";

export class dbSwitcher {
  mainTable: Model<any>;
  reserveTable: Model<any>;
  serviceName: string
  constructor(args: {
    mainTable: Model<any>,
    reserveTable: Model<any>,
    serviceName: string
  }) {
    this.mainTable = args.mainTable;
    this.reserveTable = args.reserveTable;
    this.serviceName = args.serviceName;
  }

  async init(): Promise<void> {
    await SwitcherModel.findOneAndUpdate({
    serviceName: this.serviceName,
  }, {
      readerTableName: this.mainTable.modelName,
      writerTableName: this.mainTable.modelName,
      serviceName: this.serviceName
  }, {
    upsert: true
  })}

  async switchReadTable():Promise<void> {
    await SwitcherModel.findOneAndUpdate({
      serviceName: this.serviceName,
    }, {
      readerTableName: this.mainTable.modelName,
      serviceName: this.serviceName
    }, {
      upsert: true
    })
  }
  async switchWriteTable():Promise<Model<any>> {
    [this.mainTable, this.reserveTable] =[ this.reserveTable, this.mainTable]
    await SwitcherModel.findOneAndUpdate({
      serviceName: this.serviceName,
    }, {
      writerTableName: this.mainTable.modelName,
      serviceName: this.serviceName
    }, {
      upsert: true
    })
    return this.mainTable;
  }
  static async getMainTable(serviceName: string): Promise<any | null> {
    return SwitcherModel.findOne({serviceName: serviceName});
  }
}