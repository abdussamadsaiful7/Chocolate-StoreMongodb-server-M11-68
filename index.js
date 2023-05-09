const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware;
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Chocolate store server is running')
})






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.nrvy6gz.mongodb.net/?retryWrites=true&w=majority`;


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

    const chocolateCollection = client.db('chocolateDB').collection('chocolate');

    app.get('/chocolate', async(req, res)=>{
        const cursor = chocolateCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

// send data to server
    app.post('/chocolate',async(req, res)=>{
        const newChocolate = req.body;
        console.log(newChocolate)
        const result = await chocolateCollection.insertOne(newChocolate);
        res.send(result);
    })

    // get id for update
    app.get('/chocolate/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await chocolateCollection.findOne(query);
        res.send(result);
    })

    app.put('/chocolate/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedChocolate = req.body;
        const updated = {
            $set: {
                name: updatedChocolate.name, 
                country: updatedChocolate.country, 
                photo: updatedChocolate.photo, 
                category: updatedChocolate.category,
            }
        }
        const result = await chocolateCollection.updateOne(filter, updated, options);
        res.send(result);
    })


//delete
    app.delete('/chocolate/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await  chocolateCollection.deleteOne(query);
        res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);







app.listen(port, () => {
    console.log(`Chocolate store server is running on port: ${port}`)
})