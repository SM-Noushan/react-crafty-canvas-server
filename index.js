const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 6969;

//middleware
app.use(cors());
app.use(express.json());

// database link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b6wqjn1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Connect to the "crafty-canvas" database and access its "painting-and-drawing" collection
    const craftyCanvasDB = client.db("crafty-canvas");
    const paintingAndDrawingCollection = craftyCanvasDB.collection(
      "painting-and-drawing"
    );

    // store painting data
    app.post("/painting-and-drawing", async (req, res) => {
      const newItemDetails = req.body;
      // insert the defined document into the "painting-and-drawing" collection
      const result = await paintingAndDrawingCollection.insertOne(
        newItemDetails
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log(
    //   "Close your deployment. You successfully terminate connection to MongoDB!"
    // );
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CRAFTY CANVAS SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
