import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/all', async(req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });

  router.get('/purchase', async (req, res) => {
    res.send("purchase route");
});

  router.get('/:id', async(req, res) => {
    const id = req.params.id;
  
    //Validate id is a number
    if(isNaN(id)){
      res.status(400).json({message: 'Invalid id'});
      return;
    }
  
    //By id
    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(id),
      },
    });
  
    if(product){
      res.json(product);
    }else{
      res.status(404).json({message: 'Product not found.'});
    }
  });

export default router;
