import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/all', async(req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });


  router.post('/purchase', async (req, res) => {
    // Check if the user is logged in
    if (!req.session.user_id) {
      return res.status(401).json({ message: 'Not logged in' });
    }
  
    try {
      const { 
        street, city, province, country, postal_code, 
        credit_card, credit_expire, credit_cvv, 
        invoice_amt, invoice_tax, invoice_total, cart 
      } = req.body;
  
      // Validate the required fields
      if (!street || !city || !province || !country || !postal_code || 
          !credit_card || !credit_expire || !credit_cvv || 
          !invoice_amt || !invoice_tax || !invoice_total || !cart) {
        return res.status(400).send('Missing required fields');
      }
  
      // Parse and validate numeric values
      const parsedInvoiceAmt = parseFloat(invoice_amt);
      const parsedInvoiceTax = parseFloat(invoice_tax);
      const parsedInvoiceTotal = parseFloat(invoice_total);
  
      if (isNaN(parsedInvoiceAmt) || isNaN(parsedInvoiceTax) || isNaN(parsedInvoiceTotal)) {
        return res.status(400).json({ message: 'Invoice amounts must be floats' });
      }
  
      // Parse the cart string (comma-delimited list of product IDs)
      const productIds = cart.split(',').map(id => parseInt(id.trim()));
      const productCounts = productIds.reduce((acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});
  
      const purchaseItems = [];
      const productFetchPromises = [];
  
      // Fetch product details for validation
      for (const productId of Object.keys(productCounts)) {
        productFetchPromises.push(
          prisma.product.findUnique({
            where: { product_id: parseInt(productId) },
          }).then((product) => {
            if (!product) {
              throw new Error(`Product with ID ${productId} not found`);
            }
            purchaseItems.push({
              product_id: parseInt(productId),
              quantity: productCounts[productId],
            });
          })
        );
      }
  
      // Resolve all product fetch promises
      await Promise.all(productFetchPromises);
  
      // Create the Purchase record
      const purchase = await prisma.Purchase.create({
        data: {
          customer_id: req.session.user_id,
          street,
          city,
          province,
          country,
          postal_code,
          credit_card,
          credit_expire,
          credit_cvv,
          cart,
          invoice_amt: parsedInvoiceAmt,
          invoice_tax: parsedInvoiceTax,
          invoice_total: parsedInvoiceTotal,
        },
      });
  
      // Insert the PurchaseItems into the PurchaseItem table
      const purchaseItemPromises = purchaseItems.map((item) =>
        prisma.PurchaseItem.create({
          data: {
            purchase_id: purchase.purchase_id,
            product_id: item.product_id,
            quantity: item.quantity,
          },
        })
      );
      await Promise.all(purchaseItemPromises);
  
      // Send response indicating success
      res.send('Purchase successful');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred during the purchase process');
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
