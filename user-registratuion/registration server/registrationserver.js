const express=require('express');
const mysql=require('mysql');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const cors=require('cors');
dotenv.config();

const app=express();
  //middleware
app.use(express.json());
app.use(cors());
 //create mysql connection
const db=mysql.createConnection({
  host:process.env.MYSQL_HOST,
  user:process.env.MYSQL_USER,
  password:process.env.MYSQL_PASSWORD,
  database:process.env.MYSQL_DATABASE
});
 // test mysql connection
db.connect((err)=>{
  if(err) {
    console.log('error connecting to mysql')
    return;

  }
  else{
    console.log("connected to mysql database")
  }
})

//sign up route
app.post('/register',(req,res)=>
{
  const {name,email,password,confirmPassword}=req.body;
  if(password!==confirmPassword){
    return res.status(400).send('passwords do not match')
  
  }
//hash the password
const hashedPassword=bcrypt.hashSync(password,10);
 const query='INSERT INTO users(name,email,password) VALUES(?,?,?)';
 db.query(query,[name,email,hashedPassword],(err,result)=>{
  if(err)
    {
      console.error("error inserting user",err)
    }
    res.status(201).send('user registered successfully')
 });

});


//login in route 
app.post('/login',(req,res)=>
{
  const {email,password}=req.body;
  const query='SELECT * FROM users WHERE email=?';
  db.query(query,[email],(err,results)=>
    {
      if(err){
        console.error('error fetching user', err)
        return res.status(500).send('internal server error');

      }

      if(results.length===0){
        return res.status(400).send('enter valid email')

      }
      const user=results[0];
      if(!bcrypt.compareSync(password,user.password)){
        res.status(400).send('invalid email or password');
      }
    //create JWT TOKEN
    
     const token=jwt.sign({
      userId:user.id,
      name:user.name
     },process.env.JWT_SECRET,{expiresIn:"1h"});
       
     // return the token to the client
     res.status(200).json(({token}));


    });
});
PORT=process.env.PORT;
app.listen(PORT,()=>
{
  console.log(`server running on port ${PORT}`)
})


