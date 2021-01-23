const mongoose = require("mongoose");
const path = require('path');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  barcode: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    get: (val)=>{
      return (val / 100).toFixed(2)
    },
    set: (val)=>{
      return val *100
    }
  },
  quantity: {
    type: String
  },
  shortcut: {
      type:String
  },
  removed: {
    type: Boolean,
    default: false
  }
},
{
    toJSON: {
        getters: true,
        setters: true
    }
});


const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
