

const express = require('express')
const cors = require('cors')
var jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qa3gncm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authorization;

//   if(!authHeader){
//       return res.status(401).send({message: 'unauthorized access'});
//   }
//   const token = authHeader.split(' ')[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//       if(err){
//           return res.status(403).send({message: 'Forbidden access'});
//       }
//       req.decoded = decoded;
//       next();
//   })
// }
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

// app.post('/jwt', (req, res) =>{
//   const user = req.body;
//   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
//   res.send({token})
// }) 

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



  
 

  app.get("/myReviews", async (req, res) => {
    try {
      let  query={}



    //  const{email}=req.params
    //  console.log(req.params)
      if(req.query.email){
          query={
              email: req.query.email
          }
      }
     
     
      const cursor =  Review.find(query);
      const  Reviews = await cursor.toArray();
 
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



  app.patch('/myReviews/:id',async(req,res)=>{

    const  id=req.params.id
    const status=req.body.status
    const query={_id:ObjectId(id)}
    
    
    
   
    const reviews=Review.updateOne(query)
    res.send(reviews)
    })
    
    
    app.delete("/myReviews/:id", async (req, res) => {
      const { id } = req.params;
    
      try {
        const review = await Review.findOne({ _id: ObjectId(id) });
    
        if (!review?._id) {
          res.send({
            success: false,
            error: "Product doesn't exist",
          });
          return;
        }
    
        const result = await Product.deleteOne({ _id: ObjectId(id) });
    
        if (result.deletedCount) {
          res.send({
            success: true,
            message: `Successfully deleted the ${review.name}`,
          });
        } else {
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    app.patch("/myReviews/:id", async (req, res) => {
      const { id } = req.params;
    
      try {
        const result = await Review.updateOne({ _id: ObjectId(id) }, { $set: req.body });
    
        if (result.matchedCount) {
          res.send({
            success: true,
            message: `successfully updated ${req.body.name}`,
          });
        } else {
          res.send({
            success: false,
            error: "Couldn't update  the Review",
          });
        }
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









