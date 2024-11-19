import express from 'express';
//import cors from 'cors';
import userRouter from './routes/users.js';
import productRouter from './routes/products.js';

const port = process.env.PORT || 3000;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//app.use(cors());

app.use('/api/jacket/users', userRouter);
app.use('/api/jacket/products', productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
