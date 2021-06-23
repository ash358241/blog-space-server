const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const blogCollection = client.db("blogSpace").collection("posts");

    //insert blog into database
    app.post('/addBlog', (req, res) => {
        const blog = req.body;
        console.log(blog);
        blogCollection.insertOne(blog)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("Backend is running perfectly and fine");
})