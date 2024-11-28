import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/all', async(req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });


  router.post('/purchase', async (req, res) => {
    if (!req.session.user_id) {
      return res.status(401).send('Not logged in');
    }
  
    try {
      const { 
        street, city, province, country, postal_code, 
        credit_card, credit_expire, credit_cvv, 
        invoice_amt, invoice_tax, invoice_total, cart, order_date 
      } = req.body;
  
      if (!street || !city || !province || !country || !postal_code || 
          !credit_card || !credit_expire || !credit_cvv || 
          !invoice_amt || !invoice_tax || !invoice_total || !cart || !order_date) {
        return res.status(400).send('Missing required fields');
      }
  
      const parsedInvoiceAmt = parseFloat(invoice_amt);
      const parsedInvoiceTax = parseFloat(invoice_tax);
      const parsedInvoiceTotal = parseFloat(invoice_total);
  
      if (isNaN(parsedInvoiceAmt) || isNaN(parsedInvoiceTax) || isNaN(parsedInvoiceTotal)) {
        return res.status(400).send('Invoice amounts must be numerical');
      }
  
      // Parse the cart string (comma-delimited list of product IDs)
      const productIds = cart.split(',').map(id => parseInt(id.trim()));
      const productCounts = productIds.reduce((acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});
  
      const purchaseItems = [];
      const productFetchPromises = [];
      const invalidProducts = false;

      for (const productId of Object.keys(productCounts)) {
        productFetchPromises.push(
          prisma.product.findUnique({
            where: { product_id: parseInt(productId) },
          }).then((product) => {
            if (!product) {
              invalidProducts = true;
            }
            purchaseItems.push({
              product_id: parseInt(productId),
              quantity: productCounts[productId],
            });
          })
        );
      }

      if (invalidProducts){
        return res.status(400).send('Invalid product ID');
      }
  
      await Promise.all(productFetchPromises);
  
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
          order_date,
          invoice_amt: parsedInvoiceAmt,
          invoice_tax: parsedInvoiceTax,
          invoice_total: parsedInvoiceTotal,
        },
      });
  
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
      return res.status(500).send('An error occurred');
    }
  });
  
  

  router.get('/:id', async(req, res) => {
    const id = req.params.id;

    if(isNaN(id)){
      return res.status(400).send('Id must be a number');
    }

    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(id),
      },
    });
  
    if(product){
      res.json(product);
    }else{
      return res.status(404).send('Product not found');
    }
  });

export default router;
