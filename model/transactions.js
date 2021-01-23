const mongoose = require("mongoose");
const path = require("path");

const Schema = mongoose.Schema;

const SalesList = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    unit: {
      type: Number,
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
      get: (val) => {
        return (val / 100).toFixed(2);
      },
      set: (val) => {
        return val * 100;
      },
    },
    currentPrice: {
      type: Number,
      required: true,
      get: (val) => {
        return (val / 100).toFixed(2);
      },
      set: (val) => {
        return val * 100;
      },
    },
  },
  { toJSON: { getters: true, setters: true } }
);

const TransactionsSchema = new Schema({
  salesList: [SalesList],
  date: {
    type: Date,
    required: true,
  },
  sumPrice: {
    type: Number,
    required: true,
    get: (val) => {
      return (val / 100).toFixed(2);
    },
    set: (val) => {
      return val * 100;
    },
  },
});

TransactionsSchema.set("toJSON", { getters: true, setters: true });

const Transactions = mongoose.model("Transactions", TransactionsSchema);
module.exports = Transactions;
