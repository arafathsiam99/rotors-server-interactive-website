const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hahq7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("retros-car");
    const carcollection = database.collection("allcar");
    const orderCollection = database.collection("orders");

    // get all car
    app.post("/addcar", async (req, res) => {
      const car = req.body;
      const result = await carcollection.insertOne(car);
      res.send(car);
    });
    // Get packages
    app.get("/cars", async (req, res) => {
      const result = carcollection.find({});
      const cars = await result.toArray();
      res.send(cars);
    });

    // Add order
    app.post("/placeorders", async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.send(result);
      console.log(orders);
      console.log(result);
    });

    // get single car
    app.get("/placebooking/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific package", id);
      const query = { _id: ObjectId(id) };
      const result = await carcollection.findOne(query);
      res.send(result);
      console.log(result);
    });
    // Get my booking
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting sp", id);
      const query = { email: id };
      console.log(query);
      const orders = orderCollection.find(query);
      const result = await orders.toArray();
      res.send(result);
      console.log(result);
    });
    // DELETE API
    app.delete("/deleteOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
      console.log(result);
    });
    // Manage All Package Api
    app.get("/allbooking", async (req, res) => {
      const result = orderCollection.find({});
      const order = await result.toArray();
      res.json(order);
    });
    // confirm package Api
    app.put("/confirmOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = "Confirm";
      const result = await orderCollection.updateOne(query, {
        $set: {
          status: update,
        },
      });
      res.send(result);
      console.log(result);
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello Retros Car");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
