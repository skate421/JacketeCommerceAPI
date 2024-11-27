import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/all', async(req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });


  //PURCHASE ROUTE
  router.post('/purchase', async (req, res) => {
    //Required inputs
    if(req.session.customer_id){
      const { street, city, province, country, postal_code, credit_card,  credit_expire, credit_cvv, car, invoice_amt, invoice_tax, invoice_total } = req.body;
      if(!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !car || !invoice_amt || !invoice_tax || !invoice_total) {
        return res.status(400).send('Missing required fields');
      }
    }else{
      return res.status(401).json({message: 'Unauthorized'});
    }
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
