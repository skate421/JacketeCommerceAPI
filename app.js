import express from 'express';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/users.js';
import productRouter from './routes/products.js';

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// cors middleware
app.use(cors({
  origin: 'http://localhost:5173', // react client
  credentials: true // allow cookies
}));

// express-session middleware
app.use(session({
  secret: 'fkldjbnfdkFTFT5efd3$$sdg89F',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    secure: false,  // Set to `true` if using HTTPS in production
    sameSite: 'lax',  // Consider 'none' if client and server are on different origins
    maxAge: 3600000 // 1 hour in milliseconds
  }
}));

app.use('/api/jacket/users', userRouter);
app.use('/api/jacket/products', productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
