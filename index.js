const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vw8cq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority1`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        const database = client.db('tourismDB');
        const table = database.collection('location');
        const order = database.collection('order');

        // GET API
        app.get('/show', async (req, res) => {
            const getdata = table.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single 
        app.get('/show/:id', async (req, res) => {
            const id = req.params.id;
            const getId = { _id: ObjectId(id) };
            const showId = await table.findOne(getId);
            res.json(showId);
        })

        // POST API

        app.post('/show', async (req, res) => {
            const add = req.body;
            const result = await table.insertOne(add);
            console.log(result);
            res.json(result);
        }) 

        // GET ORDER API
        app.get('/order', async (req, res) => {
            const getdata = order.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single ORDER API
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const getId = { _id: ObjectId(id) };
            const showId = await order.findOne(getId);
            res.json(showId);
        })

        // POST ORDER API

        app.post('/order', async (req, res) => {
            const add = req.body;
            const result = await order.insertOne(add);
            console.log(result);
            res.json(result);
        })
        
        //UPDATE ORDER API
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const update = {
                $set: {
                    name: updatedOrder.name, email: updatedOrder.email, place: updatedOrder.place, mobile: updatedOrder.mobile, members: updatedOrder.members, address: updatedOrder.address, status: updatedOrder.status 
                },
            };
            const result = await order.updateOne(filter, update, options);
            res.json(result);
        })

        // DELETE ORDER API
        app.delete('/order/:id', async(req, res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const deleteId = await order.deleteOne(getId);
            res.json(deleteId);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Server...')
})
app.listen(port, () => {
    console.log("Running port", port)
})






