import express from 'express';
import multer from 'multer';
import { hashPassword, comparePassword } from '../lib/utility.js'
import { PrismaClient } from '@prisma/client';
import PasswordValidator from 'password-validator';

const router = express.Router();
//Prisma setup
const prisma = new PrismaClient();
const upload = multer();



//SIGNUP ROUTE
router.post('/signup', upload.none(), async (req,res) => {
  // Create a schema
  const schema = new PasswordValidator();

  // Add properties to it
  schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(1)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces

    // get user inputs
    const { email, password, first_name, last_name } = req.body;

    // validate the inputs (to-do: validate email, enforce password policy)
    if(!email || !password || !first_name || !last_name) {
      return res.status(400).send('Missing required fields');
    }else{
          if(!schema.validate(password)){
            const failedRules = schema.validate(password, { list: true });
            return res.status(400).send(`Invalid password. Please make sure these requirements are met: ${failedRules.join(', ')}`);
        }
    }
  
    // check for existing user
    const existingUser = await prisma.customer.findUnique({
      where: {
        email: email,
      }
    });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
  
    // hash (encrypt) the password
    const hashedPassword = await hashPassword(password);
  
    // add user to database
    const user = await prisma.customer.create({
        data: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: hashedPassword
        },
      });
  
    // send a response
    res.json({'user' : email});
  });




  //LOGIN ROUTE
  router.post('/login', async (req,res) => {
    // get user inputs
    const { email, password } = req.body;
  
    // validate the inputs
    if(!email || !password) {
      return res.status(400).send('Missing required fields');
    }
  
    // find user in database
    const existingUser = await prisma.customer.findUnique({
      where: {
        email: email,
      }
    });

    if (!existingUser) {
      return res.status(404).send('User not found');
    }
  
    // compare/verify the password entered
    const passwordMatch = await comparePassword(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid password');
    }
  
    if (!req.session) {
      return res.status(500).send('Session initialization error');
    }

    // setup user session data
    req.session.email = existingUser.email;
    req.session.user_id = existingUser.customer_id;
    req.session.name = existingUser.firstName + ' ' + existingUser.lastName;
    console.log('logged in user: ' + req.session.email);
  
    // send response
    res.send('Login successful');
  });
  

  //LOGOUT OUT
  router.post('/logout', (req,res) => {
    if(req.session.user_id){
    console.log('User trying to logout: ' + req.session.email);
    req.session.destroy();
    if(!req.session){
      res.send('Successful logout');
      }else{
        return res.status(500).send('Session destroy error');
      }
    }else{
      return res.status(401).send('Not logged in');
    }
  });


  //GETSESSION
  router.get('/getsession', (req,res) => {
    if(req.session.user_id){
      res.json({
        customer_id: req.session.user_id,
        email: req.session.email,
        name: req.session.name
      });
    }else{
      return res.status(401).send('Not logged in');
    }
  });
  
export default router;
