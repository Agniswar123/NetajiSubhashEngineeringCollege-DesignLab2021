var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var aes = require('aes256');
var User = require('./models/User');
var Blog = require('./models/Blog');
var app = express();

const dbConnectionString = 'mongodb+srv://agniswar:x8mmrwm9fifakfltfifa@cluster0.kg1bg.mongodb.net/mongoTraining?retryWrites=true&w=majority';
const port = process.env.PORT || 4000;
const key = 'Design Lab';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 

mongoose
  .connect(dbConnectionString, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    })
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log("Error is ", err.message);
  });

app.get('/blogs',(req,res)=>{
  return Blog.find({}, (err, blogs)=>{
    if(err){
      console.log(err);
      return res.status(500).send({message: err.message})
    }
    // console.log("BLOGS:", blogs);

    return res.status(200).send(blogs);
  });
});

app.post('/signup', (req, res) => {
    console.log('hitting signup!')
    var {email, password} = req.body;
    if(!email || !password ){
        return res.status(401).send('Req Body must contain fields: name & password!')
    }
    password = aes.encrypt(key, password);
    var newUser = new User({
	_id:new mongoose.Types.ObjectId(),
      email,
      password
    });
    const authToken = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: email
    }, 'design lab');

    return newUser
      .save()
      .then(() => {
        return res.status(200).send({email, token: authToken});
      })
      .catch(err => {
        console.log("Error is ", err.message);
        return res.status(400).send('Bad Request!')
      });
})

app.post('/login',  (req,res)=>{
  console.log('Login Hit!')
  var {email, password} = req.body;
  if(!email || !password){
    return res.status(401).send('Req Body must contain fields: name, & password!')
  }

  return User.findOne({ email })
    .then(profile => {
      if (!profile) {
        res.status(404).send("User does not exist");
      } else {        
        if(password === aes.decrypt(key, profile.password)){
          const authToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: email
          }, 'design lab');
          return res.status(200).send({email, token: authToken});
        } else {
          return res.status(401).send('User Unauthorized Access!');
        }
      }
    })
    .catch(err => {
      console.log("Error is ", err.message);
    });
});


app.post('/blog', (req,res)=>{
  try{
    const token = req.header('Authorization').replace('Bearer ', '');
    const {email, title, content, imageLink} = req.body;
    const {data} = jwt.verify(token, 'design lab');

    if(data !== email){
      throw new Error('User Mismatch!');
    }

    const blog = new Blog({
	_id:new mongoose.Types.ObjectId(),
      email,
      title,
      content,
      imageLink
    })
    return blog
    .save()
    .then(()=> res.status(200).send({message: 'Blog Created!'}))
    .catch( e => {console.log(e); res.status(500).send({message: e.message})});

  } catch(e) {
    console.log(e);
    return res.status(401).send({message: e.message})
  }

})

app.listen(port,()=>{
   console.log(`Server is listening on port ${port}`)
});
