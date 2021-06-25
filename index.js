const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
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

    //read blogs from database
    app.get('/blogs', (req, res) => {
        blogCollection.find({}) 
            .toArray((err, documents) => {
                res.send(documents);
                console.log(err);
            })
    })

    //read individual blog from database
    app.get('/blog/:blogId', (req, res) => {
      blogCollection.find({_id:ObjectId(req.params.blogId)})
      .toArray((err, blogs) => {
          res.send(blogs[0]);
      })
  })

    //delete blog from database
    app.delete('/deleteBlog/:id', (req, res) => {
      blogCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0);
      })
    })
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);