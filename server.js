const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URI;



  

  app.listen(3000, function() {  console.log('listening on 3000')})
  app.use(bodyParser.urlencoded({extended: true}))

MongoClient.connect(url, { useUnifiedTopology: true })
.then(client => {  
    console.log('Connected to Database');
    const db = client.db('TechBarDeviceRecords');
    const devicesCollection = db.collection('devices');
    
    //Middleware//
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.json())
    
    /*Add new entry to database*/
    app.post('/devices', (req, res) => {
        devicesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
            console.log(req.body)
          })
          .catch(error => console.error(error))
    })

    /*Display all database entries*/
    app.get('/', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('index.ejs', { devices: results })
        })
        .catch(error => console.error(error))
      })

      /*app.get('/', (req, res) => {
        devicesCollection.find({name:"Mickey Mouse"}).toArray() 
          .then(results => {
            res.render('index.ejs', { devices: results })
          })
          .catch(error => console.error(error))
        })*/

    
         /*Replace an entry with a new one*/  
        app.put('/quotes', (req, res) => {
        devicesCollection.findOneAndUpdate
        (
          { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote,
          },
        },
        {
          upsert: true,
        }
      )
          .then(result => {
          res.json('Success')
           })
          .catch(error => console.error(error))
      })

      /*Delete an entry*/
      app.delete('/quotes', (req, res) => {
        devicesCollection
          .deleteOne({ name: req.body.name })
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vader's quote`)
            })
          .catch(error => console.error(error))
      })



  })
  
.catch(error => console.error(error))






//app.get('/', (req, res) => {  res.sendFile(__dirname + '/index.html')  })// - no longer required after ejs view added//

//https://zellwk.com/blog/crud-express-mongodb/ npm run dev//