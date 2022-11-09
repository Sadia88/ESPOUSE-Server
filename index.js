const express = require('express')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
var cors = require('cors')

app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qa3gncm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    
        try {
          await client.connect();
          console.log("Database connected with server");
        } catch (error) {
          console.log(error.name, error.message);
        }
      
}
run()



const Service = client.db("espousedb").collection("services");
const Review = client.db("espousedb").collection("reviews");



app.post("/add-service", async (req, res) => {
  try {
    
    const result = await Service.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't add the service",
      });
    }
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});


app.get("/home-service", async (req, res) => {
  try {
    const query={}
    const sort = { length: 1 };
    const cursor = Service.find(query).sort(sort);
    const Services = await cursor.limit(3).toArray();
// console.log(Services[1])
    res.send({
      success: true,
      message: "Successfully got the data",
      data: Services,
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});


app.get("/services", async (req, res) => {
  try {
    const query={}
    
    const cursor = Service.find(query);
    const Services = await cursor.toArray();
// console.log(Services[1])
    res.send({
      success: true,
      message: "Successfully got the data",
      data: Services,
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});


app.get("/service/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const service = await  Service.findOne({ _id: ObjectId(id) });
// console.log(service._id.toString())
    res.send({
      success: true,
      data:  service,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});




app.post("/reviews", async (req, res) => {
  try {
    
    const result = await Review.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't add the service",
      });
    }
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});


app.get("/reviews", async (req, res) => {
  try {
    const query={}
   
    const cursor =  Review.find(query);
    const  Reviews = await cursor.toArray();
console.log(Review)
    res.send({
      success: true,
      message: "Successfully got the data",
      data:  Reviews,
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});


  app.get("/all-review/:id", async (req, res) => {
    try {
      const { id } = req.params;
     
      const cursor = Review.find({ serviceId: id });
      const  reviews = await cursor.toArray();

      console.log(reviews)
      res.send({
        success: true,
        data:  reviews,
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  });



  
 

  




  
  
  

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
