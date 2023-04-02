/* Module dependencies */
const express = require('express');
const Car = require('../models/cars');


const csv = require('csv-parser');

const fs = require('fs')

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

/* Create router */
const route = express.Router();

/* Route definitions */

// Dashboard page
route.get("/",(req,res)=>{
    Car.find().exec((err,cars)=>{
        if(err){
            res.json({message:err.message});
        }else{
            res.render('dashboard',{title:"Dashboard Page",cars:cars,});
        }
    })
})


// Route to display details of a specific car
route.get('/cars/:id', async function(req, res) {
    var carId = req.params.id;
    // Find the car object with ID equal to carId
    var cars = await Car.find({_id: carId});
    console.log({cars})
    if (!cars) {
      // Handle case where car object with ID equal to carId is not found
      res.status(404).send('Car not found');
    } else {
      res.render('dashboard', {title:"Single Car Page", cars: cars }); // Render car detail page with car object data
    }
  });

// fetch create record page
route.get("/createRecord",(req,res)=>{
    res.render('createRecord',{title:"Upload Record",isEdit:false});
})



// Upload record post request

route.post("/createRecord",(req,res)=>{
    let features = [];

    let feature = req.body.feature;

    if(feature.trim() != ""){
    features = feature.split()
    }
   
   

   
 

    
   


    const car = new Car({
        maker: req.body.maker,
        model: req.body.model,
        manufacture_year: req.body.manufactureYear,
        mileage: req.body.mileage,
        engine_displacement: req.body.engineDisplacement,
        engine_power: req.body.enginePower,
        body_type: req.body.bodyType,
        stk_year: req.body.stkYear,
        transmission: req.body.transmission,
        other_data: {
          features: features,
          owner: {
            name: req.body.owner_name,
            email: req.body.owner_email,
            phone: req.body.owner_phone
          },
          Age:30
        }
      });
      
     
      

    car.save((err)=>{
         if(err){
            res.json({message:err.message, type:'danger'});
        }else{
            req.session.message = {
                type:'success',
                message: 'Record uploaded successfully'
            };
            res.redirect('/');
        }
    })
})


// Upload CSV record

route.post('/csv', upload.single('csv'), (req, res) => {
    const data = [];

    AdminName = "Ikenna";
    AdminEmail = "Admin@support.com";
    AdminNumber ="+4467059";
    
  
    // Open the uploaded file using the fs module
    const stream = fs.createReadStream(req.file.path);
  
    // Use the csv-parser module to read the CSV file
    stream.pipe(csv())
          .on('data', (row) => {
            data.push(row); // Add the row to the data array
          })
          .on('end', () => {
            // Clean up the uploaded file after it has been processed
            fs.unlinkSync(req.file.path);

            

            //res.render('dashboard',{title:"Dashboard Page",cars:data,});
  
            // Do something with the data array
            data.forEach(item =>{

                if(item.model != '' && item.maker != ''){

                    const Storedata = new Car ({

                        maker: item.maker,
                        model: item.model,
                        mileage: item.mileage,
                        manufacture_year: item.manufacture_year,
                        engine_displacement:item.engine_displacement,
                        engine_power:item.engine_power,
                        body_type:item.body_type,
                        color_slug:item.color_slug,
                        stk_year:item.stk_year,
                        transmission:item.transmission,
                        door_count:item.door_count,
                        seat_count:item.seat_count,
                        fuel_type:item.fuel_type,
                        date_last_seen:item.date_last_seen,
                        dateUploaded:item.date_created,
                        price_eur:item.price_eur,
                        other_data: {
                            features: [],
                            owner: {
                              name: AdminName,
                              email: AdminEmail,
                              phone: AdminNumber
                            }
                        }
    
                    })
                    Storedata.save();

                }
                
              
                
            })
            res.redirect('/');
           
          });
  });



  route.get('/cars/:id/delete', async function(req, res) {
    var carId = req.params.id;
    // Find the index of the car object with ID equal to carId
    var index = await Car.findOneAndDelete({_id: carId});
    if (!index) {
      // Handle case where car object with ID equal to carId is not found
      res.status(404).send('Car not found');
    } else {
      // Remove the car object from the cars array
      
    }// Redirect back to car list page after deletion
    res.redirect('/'); // Redirect back to car list page after deletion
  });

  // Route to display form to edit a specific car
route.get('/cars/:id/edit', async function(req, res) {
    var carId = req.params.id;
    // Find the car object with ID equal to carId
    var car =  await Car.findOne({_id:carId});
   
    if (!car) {
      // Handle case where car object with ID equal to carId is not found
      res.status(404).send('Car not found');
    } else {
      res.render('createRecord', { title: "Edit page", car: car, isEdit: true }); // Render car detail page with car object data
    }
  });

   // Route to update a specific car
  route.put('/cars/:id/update', function(req, res) {
    var carId = req.params.id;
    // Find the index of the car object with ID equal to carId
    var index = cars.findIndex(function(car) {
      return car._id === carId;
    });
    if (index === -1) {
      // Handle case where car object with ID equal to carId is not found
      res.status(404).send('Car not found');
    } else {
      // Update the car object with data from updatedCarData
      cars[index].maker = updatedCarData.maker;
      cars[index].model = updatedCarData.model;
      cars[index].manufacture_year = updatedCarData.manufacture_year;
      cars[index].mileage = updatedCarData.mileage;
      cars[index].engine_displacement = updatedCarData.engine_displacement;
      cars[index].engine_power = updatedCarData.engine_power;
      cars[index].body_type = updatedCarData.body_type;
      cars[index].stk_year = updatedCarData.stk_year;
      cars[index].transmission = updatedCarData.transmission;
      cars[index].other_data = updatedCarData.other_data;
      res.redirect('/cars/' + carId); // Redirect to car detail page after edit
    }
  });
  


  

/* Export router */
module.exports = route;