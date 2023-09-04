//Server-side code//

const express = require('express');
const session = require('express-session'); // express-sessions
const { v4: uuidv4 } = require('uuid'); // uuid, To call: uuidv4();
const bodyParser= require('body-parser');
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
const User = require('./user.js'); // User Model
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const app = express();


// Include Express Validator Functions
const { check, validationResult } = require('express-validator');

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
  

    // Configure Sessions Middleware
    app.use(session({
      genid: function (req) {
        return uuidv4();
      },
      secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Passport Local Strategy
    passport.use(User.createStrategy());

    // To use with sessions
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    /*Display Add screen - WORKING*/ 
    app.get('/add.ejs', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('add.ejs')
        })
        .catch(error => console.error(error))
      })

      // Home Page Route
      app.get('/home.ejs', (req, res) => {
      res.send(req.sessionID);
        });

      /*Code for login function*/
      // Route to Login Page
    app.get('/', (req, res) => {
     res.render('login.ejs');
    });

// Route to Dashboard
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
  and your session expires in ${req.session.cookie.maxAge} 
  milliseconds.<br><br>
  <a href="/logout">Sign Out</a><br><br><a href="/index.ejs">Proceed to Device Records</a>`);
});

// Route to Home Page
app.get('/index.ejs', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render('index.ejs');
});


// Route to Log out
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
  if (err) { return next(err); }
  res.render('logout.ejs');
});
});

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	console.log(req.user)
	res.redirect('/dashboard');
});


   /*Add new entry to database - WORKING*/
    app.post('/devices', (req, res) => {
        devicesCollection.insertOne(req.body)
          .then(result => {
            res.render('add.ejs')
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

      /* Display Add page - WORKING*/
      app.get('/add.ejs', (req, res) => {
        devicesCollection.find().toArray()
          .then(results => {
            res.render('add.ejs')
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

       /*Display Update page - WORKING */
    app.get('/update.ejs', (req, res) => {
      devicesCollection.find().toArray()
        .then(results => {
          res.render('update.ejs')
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
          res.json('Success');
          })
           .catch(error => console.error(error))
           });

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

