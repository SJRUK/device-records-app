//Server-side code//

const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URI;


  app.listen(3000, function() { console.log('listening on 3000')})
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
    

    /*Display home screen - WORKING*/ 
    app.get('/', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('index.ejs')
        })
        .catch(error => console.error(error))
      })

    /*Add new entry to database - WORKING*/
    app.post('/devices', (req, res) => {
        devicesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
            console.log(req.body)
          })
          .catch(error => console.error(error))
    })

    /*Display all database entries - WORKING*/
    app.get('/deviceList.ejs', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('deviceList.ejs', { devices: results })
        })
        .catch(error => console.error(error))
      })


      /*Display search page - WORKING */
    app.get('/search.ejs', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('search.ejs')
        })
        .catch(error => console.error(error))
      }) 

           /*Display Delete page - WORKING */
    app.get('/delete.ejs', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('delete.ejs')
        })
        .catch(error => console.error(error))
      }) 




        /*Search function - WORKING*/
        app.post('/search', (req, res) => {
        const { assetTag } = req.body;
        devicesCollection
          .find({"assetTag": assetTag})
          .toArray()
           .then(results => {
            console.log(results)
            res.json(results);
                      })
          .catch(error => console.error(error))
          });
        
        

    
         /*Replace an entry with a new one - WORKING*/  
        app.put('/update', (req, res) => {
          const { assetTag, name, organisation, lineManager, dateRequired } = req.body;
          devicesCollection.findOneAndUpdate(
          { assetTag: assetTag},// Filter the document to update based on the name field
          { 
            $set: {
              name: name, 
              organisation: organisation,
              lineManager: lineManager,
              dateRequired: dateRequired
           } // Updates the fields with the new values
          },
          { upsert: true } // Create a new document if the filter does not match any existing document
        )
         .then(result => {
          res.json('Success')
           })
           .catch(error => console.error(error))
      })

      /*Delete an entry - WORKING*/
      app.delete('/delete', (req, res) => {
        const { assetTag } = req.body;
        devicesCollection
          .deleteOne({"assetTag": assetTag})
          .then(result => {
            if (result.deletedCount === 0) {
              console.log(req.body)
              return res.json('Nothing to delete')
            }
            res.json('Deleted')
            })
          .catch(error => console.error(error))
          })

      


  })
  
.catch(error => console.error(error))







//https://zellwk.com/blog/crud-express-mongodb/ npm run dev//