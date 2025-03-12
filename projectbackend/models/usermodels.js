const{pool}=require('../config/db')
 const createUser=(firstName, lastName, email, hashedPassword, callback)=>{
  const sql="INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)"
  pool.query(sql,[firstName, lastName, email, hashedPassword],callback);


 };

 const findUserByEmail=(email,callback)=>{
  const sql='SELECT * FROM users  WHERE email=?'
  pool.query(sql,[email], callback)
 }
 module.exports = { createUser, findUserByEmail };