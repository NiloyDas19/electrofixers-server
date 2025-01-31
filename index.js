const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 5000
const app = express()


// middleware

app.use(cors({
    origin: ['https://electrofixers-6499c.web.app', 'http://localhost:5173'],
}));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x3wylq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        const servicesCollection = client.db("servicesDB").collection('services');
        const bookedServicesCollection = client.db("servicesDB").collection('bookedServices');

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        app.get('/book-service', async (req, res) => {
            const cursor = bookedServicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const newService = req.body;
            console.log(newService);
            const result = await servicesCollection.insertOne(newService);
            res.send(result);
        })

        app.post('/book-service', async (req, res) => {
            const newBookedService = req.body;
            console.log(newBookedService);
            const result = await bookedServicesCollection.insertOne(newBookedService);
            res.send(result);
        })


        app.put('/update-service/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedService = req.body;

            const updateService = {
                $set: {
                    imageUrl: updatedService.imageUrl,
                    serviceName: updatedService.serviceName,
                    price: updatedService.price,
                    serviceArea: updatedService.serviceArea,
                    description: updatedService.description,
                    providerEmail: updatedService.providerEmail,
                    providerImageUrl: updatedService.providerImageUrl,
                    providerName: updatedService.providerName,
                }
            }
            const result = await servicesCollection.updateOne(filter, updateService, options);
            res.send(result);
        })

        app.put('/update-booked-service/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedService = req.body;

            const updateService = {
                $set: {
                    status: updatedService.newStatus,
                }
            }
            const result = await bookedServicesCollection.updateOne(filter, updateService, options);
            res.send(result);
        })

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('elctrofixers server is running...');
})


app.listen(port, () => {
    console.log(`elctrofixers server is running in the ${port} port`);
})

