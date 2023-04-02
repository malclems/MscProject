//const { default: mongoose } = require('mongoose');

const mongoose = require('mongoose');


var Schema = mongoose.Schema;



const carSchema = new mongoose.Schema({
  maker: String,
  model: String,
  manufacture_year: Number,
  mileage: Number,
  engine_displacement: Number,
  engine_power: Number,
  body_type: String,
  stk_year: Number,
  transmission: String,
  other_data: mongoose.Schema.Types.Mixed  // Field for unstructured data
});

module.exports = mongoose.model('Car', carSchema);