const mongoose = require('mongoose');
const uri = "mongodb+srv://Priyank1980p:priyank123@cluster0.mw8fpgu.mongodb.net/Pincode?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
