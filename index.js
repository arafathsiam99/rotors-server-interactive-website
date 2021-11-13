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
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");

    // Add Car
    app.post("/addcar", async (req, res) => {
      const car = req.body;
      const result = await carcollection.insertOne(car);
      res.send(car);
    });
    // Get AllCars
    app.get("/allcars", async (req, res) => {
      const result = carcollection.find({});
      const cars = await result.toArray();
      res.send(cars);
    });
    // Get ManageCars
    app.get("/managecars", async (req, res) => {
      const result = carcollection.find({});
      const cars = await result.toArray();
      res.send(cars);
    });

    // Get Cars
    app.get("/cars", async (req, res) => {
      const result = carcollection.find({}).limit(6);
      const cars = await result.toArray();
      res.send(cars);
    });

    // Add order
    app.post("/placeorders", async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.send(result);
    });
    // get reviews
    app.get("/review", async (req, res) => {
      const result = reviewCollection.findOne({});
      const review = await result.toArray();
      res.send(review);
    });
    // Add Reviews
    app.post("/addreviews", async (req, res) => {
      const addreviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.send(result);
      console.log(addreviews);
    });
    // get single Review
    app.get("/placereview/:id", async (req, res) => {
      console.log("getting review", id);
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
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
    // Delet from Manage Car
    app.delete("/deleteManageOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carcollection.deleteOne(query);
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
    });
    // Get User Api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      console.log("put", user);
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
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
