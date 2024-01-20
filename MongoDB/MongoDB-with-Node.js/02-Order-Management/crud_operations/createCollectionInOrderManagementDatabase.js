// create an order-management Database

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const connectionURI =
  "mongodb+srv://<user_name>:<password>/order-management?retryWrites=true&w=majority"; //TODO: insert a connection string

// connect to database
mongoose
  .connect(
    "mongodb+srv://nyangweso-rodgers:Mqns718Gf5Ixgk68@test-cluster.uo4jsy5.mongodb.net/order-management?retryWrites=true&w=majority" //TODO: insert a connection string
  )
  .then(() => {
    // create sale_order collection within the order-management DB
    return mongoose.connection.createCollection("sale_order");
  })
  .then(() =>
    console.log(
      "Connected to MongoDB, created an order-management DB with sale-order collection"
    )
  )
  .catch(() => console.log("MongoDB connection error!"));
