import express from 'express';
import cors from "cors"
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const app = express();
app.use(express.json())
app.use(cors());
const PORT = 5000;

const client = new MongoClient(process.env.MONGO_DB_CLIENT_URI);
export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

const connectedDB = await connectToMongoDB()
const database = connectedDB.db("hire-loop")
const users = database.collection("user")
const jobs = database.collection("jobs")

app.get('/', (req, res) => {
    res.send('Hello World!');
});


//user information  
app.get("/users", async (req, res) => {
    const resutl = await users.find({}).toArray()
    res.send(resutl)

})



app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});