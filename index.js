const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// userName "monsuralam8897"
// password ""

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
   "mongodb+srv://monsuralam8897:DOyaBbg2bzbPvOQF@cluster0.kjf5ogd.mongodb.net/?retryWrites=true&w=majority";

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
      const userCollection = client.db("UserDB").collection("users");

      app.get("/users", async (req, res) => {
         const cursor = userCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });

      app.get("/users/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const user = await userCollection.findOne(query);
         console.log(user);
         res.send(user);
      });

      app.post("/users", async (req, res) => {
         user = req.body;
         const result = await userCollection.insertOne(user);
         console.log(result);
         res.send(result);
      });

      app.put("/users/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) };
         const user = req.body;
         const options = { upsert: true };
         const updatedUser = {
            $set: {
               name: user.name,
               email: user.email,
            },
         };

         const result = await userCollection.updateOne(
            filter,
            updatedUser,
            options
         );
         res.send(result);
      });

      app.delete("/users/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await userCollection.deleteOne(query);
         console.log(result);
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();s
   }
}
run().catch(console.dir);

// database file end

app.get("/", (req, res) => {
   res.send("Hello crud server where you are");
});
app.listen(port, (req, res) => {
   console.log(`Server listening on ${port}`);
});
