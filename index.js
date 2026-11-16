import express from 'express';
import cors from "cors"
import { MongoClient, ObjectId } from 'mongodb';
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
const application = database.collection("application")

app.get('/', (req, res) => {
    res.send('Hello World!');
});


//user information  
app.get("/users", async (req, res) => {
    const resutl = await users.find({}).toArray()
    res.send(resutl)

})

// recrutier add new jobs == from
app.post("/jobs", async (req, res) => {
    const jobsData = req.body
    const result = await jobs.insertOne(jobsData)
    res.send(result)


})

/// recruiter all job data 
app.get("/jobs", async (req, res) => {
    const { search, type, department, company } = req.query;
    const query = {};
    // Search by title, company, type and department
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { department: { $regex: search, $options: "i" } }
        ];
    }
    // Filter by type
    if (type) {
        query.type = type;
    }
    if (company) {
        query.company = company
    }
    // Filter by department
    if (department) {
        query.department = department;
    }

    const result = await jobs.find(query).toArray();

    res.send(result);
});

// job dtails page
app.get("/jobs/:id", async (req, res) => {
    const { id } = req.params;
    const result = await jobs.findOne({
        _id: new ObjectId(id),
    });
    res.send(result);
});


// recuiter job data delete
app.delete("/jobs/:id", async (req, res) => {
    const { id } = req.params;
    const result = await jobs.deleteOne({
        _id: new ObjectId(id),
    });
    res.send(result);
});
// application jara job apply korbe tader application
app.post("/application", async (req, res) => {
    const applications = req.body
    const result = await application.insertOne(applications)
    res.send(result)

})
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});