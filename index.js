const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const port = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hobby Hub Server")
})

// Connect MogoDb Here

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.gnlwsvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

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

    // User relted APIs
    const userCollection = client.db("hobbyHubDb").collection("users")
    const groupCollection = client.db("hobbyHubDb").collection("groups")

    // users related APIS
    app.post("/users", async(req,res)=>{
        const newUser = req.body
        const result = await userCollection.insertOne(newUser)
        console.log(newUser)
        res.send(result)
    })

    app.get("/users", async(req,res)=>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })

    // Group Related APIS
    app.post("/groups", async(req,res)=>{
        const newGroup = req.body 
        const result = await groupCollection.insertOne(newGroup)
        res.send(result)
    })

    app.get("/groups", async(req,res)=>{
        const result = await groupCollection.find().toArray()
        res.send(result)
    })

    app.get("/groups/:id", async(req,res)=>{
        const id = req.params.id
        const filter = { _id : new ObjectId(id)}
        const result = await groupCollection.findOne(filter)
        res.send(result)
    })

    app.delete("/groups/:id", async (req,res)=>{
        const id = req.params.id 
        const query = { _id : new ObjectId(id)}
        const result = await groupCollection.deleteOne(query)
        res.send(result)
    })

    app.put("/groups/:id", async (req,res)=>{
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updatedCoffee = req.body
        const updatedDoc = {
            $set: updatedCoffee
        }
        const result = await groupCollection.updateOne(filter,updatedDoc,options)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log(`App listening from: ${port}`)
})