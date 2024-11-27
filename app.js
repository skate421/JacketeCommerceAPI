import express from 'express';
import userRouter from './routes/users.js';
import productRouter from './routes/products.js';
import cors from 'cors';
import session from 'express-session';

const port = process.env.PORT || 3000;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/api/jacket/users', userRouter);
app.use('/api/jacket/products', productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
