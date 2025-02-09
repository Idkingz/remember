import mongoose from 'mongoose'


export async function connect(){
    return mongoose.connect(url) 
}

export async function disconnect(){
    return mongoose.disconnect()
}
