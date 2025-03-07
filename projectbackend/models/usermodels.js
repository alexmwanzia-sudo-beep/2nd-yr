const db=require('../config/db.js');
const getUserByid=(userId,callback) =>{
  const query = 'SELECT id, name, email, phone, profile_picture FROM users WHERE id = ?';
  db.query(query, [userId], callback) 
};

//update user profile picture

const updateUserProfile = (userId, name, email, phone, callback) => {
  const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(query, [name, email, phone, userId], callback);
};

//update profile picture
const updateProfilePicture = (userId, profilePicture, callback) => {const query = 'UPDATE users SET profile_picture = ? WHERE id = ?';
  db.query(query, [profilePicture, userId], callback);
};
//update password
const updatePassword = (userId, hashedPassword, callback) => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  db.query(query, [hashedPassword, userId], callback);
};
const updatePassword = (userId, hashedPassword, callback) => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  db.query(query, [hashedPassword, userId], callback);
};
module.exports = {
  getUserById,
  updateUserProfile,
  updateProfilePicture,
  updatePassword
};

