
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;


// middle ware 
app.use(cors());
app.use(express.json())

const uri = `mongodb://${process.env.DB_User}:6DydBrgmus48OjDh@ac-v3pf2i9-shard-00-00.aic4ezy.mongodb.net:27017,ac-v3pf2i9-shard-00-01.aic4ezy.mongodb.net:27017,ac-v3pf2i9-shard-00-02.aic4ezy.mongodb.net:27017/?ssl=true&replicaSet=atlas-s0bfev-shard-0&authSource=admin&appName=Cluster1`

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
    const usersCollection = client.db('GardenApp').collection('gardeners');
    const tipCollection = client.db('GardenApp').collection('Top-Tips');
    
    app.get('/', (req, res) => {
      res.send('Hello World!p-10 my name is jayed!');
    });


    // create data

    app.post('/users', async(req, res) => {
      const user = req.body;
      const email = user.email;
      const users = await usersCollection.find().toArray();
      const existingEmail = users.find( user => user.email === email);
      if(existingEmail) {
        return res.send({
          message: "User already exists",
        })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.post('/tips' , async(req,res) => {
      const tip = req.body;
      const result = await tipCollection.insertOne(tip);
      res.send(tip);
    });

    //read data

    app.get('/users', async(req,res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

     app.get('/ActiveUsers', async(req,res) => {
      const users = await usersCollection.find().limit(6).toArray();
      res.send(users);
    });

    app.get('/user/:email' , async(req,res) => {
      const email = req.params.email;
      const query = {email : email};
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

    app.get('/tips', async(req,res) => {
      const tips = await tipCollection.find().toArray();
      res.send(tips);
    } );

    app.get('/tips/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await tipCollection.findOne(query);
      res.send(result);
    });

    app.get('/usertips/:email', async(req,res) => {
        const email = req.params.email;
        const query = {userEmail : email};
        const result = await tipCollection.find(query).toArray();
        res.send(result);
    } )

  // upadate data
  app.put('/tips/:id' , async(req,res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const updatedTip = req.body;
    const updatedDoc = {
      $set :updatedTip
    };
    const result = await tipCollection.updateOne(query,updatedDoc);
    res.send(result);
    
  })

  // delete data
  app.delete('/tips/:id' , async(req,res) => {
     const id = req.params.id;
     const query = {_id : new ObjectId(id)};
     const result = await tipCollection.deleteOne(query);
     res.send(result);
  })

    // app.put('/tips/:id' , (req,res) => {
    //   const id = req.params.id;
    //   const query = {id : new ObjectId(id)},
    //   const UpdatedTip = req.body;
    //   console.log(UpdatedTip);
    // })




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Garden-App
// umieqXKzm5orPV0K
//6DydBrgmus48OjDh