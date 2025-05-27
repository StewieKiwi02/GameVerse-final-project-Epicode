const mongoose = require('mongoose');

const connectDB = async () =>{
    try{

        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB è connesso: ${connect.connection.host}`);
    }catch(error){
        console.error("Errore connessione MongoDB: " + error.message);
        process.exit(1)//ferma tutto se fallisce
    }
};

module.exports = connectDB;
