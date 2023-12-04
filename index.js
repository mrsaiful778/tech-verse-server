const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvc5ptn.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();


    const featuredCollection = client.db('featuredDB').collection('features')
    const upVoteCollection = client.db('featuredDB').collection('upvote')
    const reviewCollection = client.db('featuredDB').collection('review')
    const trandingCollection = client.db('featuredDB').collection('tranding')
    const userCollection = client.db('featuredDB').collection('user')

    //user collection

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    app.patch('/users/moderator/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          role: 'moderator',
          
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    })

    
    
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          role: 'admin',
          
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    })


    // app.get('/allUsers/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email }
    //   const user = await userCollection.findOne(query);
    //   let admin = false;
    //   if(user){
    //     admin = user?.role == 'admin'
    //   }
    //   res.send({admin})
    // })

    //tranding
    app.post('/tranding', async (req, res) => {
      const tranding = req.body;
      const result = await trandingCollection.insertOne(tranding)
      res.send(result)
    })

    app.get('/tranding', async (req, res) => {
      const result = await trandingCollection.find().toArray()
      res.send(result)
    })
    app.put('/tranding/:id', async (req, res) => {
      const id = req.params.id;
      const tranding = req.body.tranding;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateTranding = {
        $set: {
          tranding: tranding + 1
        }
      }
      const result = await trandingCollection.updateOne(filter, tranding, options)
      res.send(result)
    })
    app.patch('/productUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          productName: product.productName,
          productImage: product.productImage,
          ownerName: product.ownerName,
          ownerEmail: product.ownerEmail,
          ownerImage: product.ownerImage,
          tags: product.tags,
          externallinks: product.externallinks,
          description: product.description
        }
      }
      const result = await trandingCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete('/tranding/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await trandingCollection.deleteOne(query);
      res.send(result)
    })

    //upvote

    app.post('/upvotes', async (req, res) => {
      const upVotes = req.body;

      const result = await upVoteCollection.insertOne(upVotes)
      res.send(result)
    })
    app.get('/upvotes', async (req, res) => {
      const result = await upVoteCollection.find().toArray()
      res.send(result)
    })
    //review 
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.send(result);
    })

    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find().toArray()
      res.send(result)
    })

    //Featured Collection poll up

    app.post('/features', async (req, res) => {
      const features = req.body;
      const result = await featuredCollection.insertOne(features);
      res.send(result)
    })

    app.get('/features', async (req, res) => {

      const result = await featuredCollection.find().toArray()
      res.send(result)

    })

    app.put('/features/:id', async (req, res) => {
      const id = req.params.id;
      const upVote = req.body.upVote;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateVote = {
        $set: {
          upVote: upVote + 1
        }
      }
      const result = await featuredCollection.updateOne(filter, updateVote, options)
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


app.get('/', (req, res) => {
  res.send('server is running')
})


app.listen(port, () => {
  console.log(`server is running on port: ${port}`)
});