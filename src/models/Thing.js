import mongoose from 'mongoose'
const { Schema } = mongoose

const ThingSchema = new Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  value: { 
    type: String, 
    required: true 
  },
})

export default mongoose.model('Thing', ThingSchema)



