import bcrypt from 'bcrypt';
const saltRounds = 10;

const password = 'Rohit@123.'; 
const encryptPassword = await bcrypt.hash(password, saltRounds);
console.log('Encrypted Password:', encryptPassword);