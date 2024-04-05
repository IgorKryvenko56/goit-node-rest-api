import express from "express";
import morgan from "morgan";
import cors from "cors";
const mongoose = require('mongoose');

const DB_HOST = "mongodb+srv://ikryvenko:VrFieFrMhBxNFZ6g:@cluster0.theue9z.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0"

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  });
  



import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ikryvenko:VrFieFrMhBxNFZ6g@cluster0.theue9z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

//7UNftLVPWwdfP8yU- Igor for Project Node.js;
//VrFieFrMhBxNFZ6g- ikryvenko for Project0;
//mongodb+srv://ikryvenko:<password>@cluster0.theue9z.mongodb.net/
