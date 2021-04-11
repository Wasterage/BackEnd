const mysql = require('mysql');
const express=require('express');
const cors = require('cors');
var app=express();
const bodyparser=require('body-parser');

app.use(cors());
app.use(bodyparser.json());

//Establish connection with mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "wasterage"
});

//Return connection status
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//Define Port
app.listen(8080,()=>
  console.log('Server started at port 8080')
);

//Bin
const bin='/bin';

//CREATE
app.post(bin,(req,res)=>{
  let specs=req.body;
  con.query("INSERT INTO Bin SET ?",specs,(err,rows,fields)=>{
  if(err) throw err;
  res.send(JSON.stringify(rows["insertId"]))
  })
})

//READ
app.get(bin,(req,res)=>{
  con.query('SELECT * from Bin',(err,rows,fields)=>{
    if(err) throw err;
    res.json(rows);
  })
})

//Update
app.put(bin+'/:Bin_ID',(req,res)=>{
  let task=req.body;
  con.query('UPDATE Bin SET `level`=? where `Bin_Id`=?',[task.filled,req.params.Bin_Id],(err,rows,fields)=>{
  if(err) throw err;
  res.send('Updated Successfully')
  })
})

//Citizen
const citizen = "/citizen";
var salt = bcrypt.genSaltSync(10);

//CREATE 
app.post(citizen,(req,res)=>{
  let user = req.body;
  var hash = bcrypt.hashSync(user["password"], salt);
  user["password"] = hash;
  con.query("INSERT INTO Citizen SET ?",user,(err,rows,fields)=>{
  if(err) throw err;
  res.send(JSON.stringify(rows))
  })
})

//Login
app.get(citizen+'/:email/:password',(req,res)=>{
  con.query('SELECT password from Citizen where `email`=?',[req.params.email], (err,rows,fields)=>{
    if(err) throw err;
    if(rows.length == 1) {
      let pass = rows[0]["password"];
      let out = {
          "exists" : 1,
          "valid": bcrypt.compareSync(req.params.password, pass)
      }
    } else {
      let out = {
          "exists" : 0
      }
    }
    res.send(out);
  })
})

//Driver
const driver = "/driver";

//CREATE 
app.post(driver,(req,res)=>{
  let user = req.body;
  var hash = bcrypt.hashSync(user["password"], salt);
  user["password"] = hash;
  con.query("INSERT INTO Driver SET ?",user,(err,rows,fields)=>{
  if(err) throw err;
  res.send(JSON.stringify(rows))
  })
})

//Login
app.get(driver+'/:email/:password',(req,res)=>{
  con.query('SELECT password from Driver where `email`=?',[req.params.email], (err,rows,fields)=>{
    if(err) throw err;
    if(rows.length == 1) {
      let pass = rows[0]["password"];
      let out = {
	      "exists" : 1,
 	      "valid": bcrypt.compareSync(req.params.password, pass)
      }
	  } else {
      let out = {
          "exists" : 0
      }
    }
    res.send(out);
  })
})