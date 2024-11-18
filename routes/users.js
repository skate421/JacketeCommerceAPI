import express from 'express';
//import multer from 'multer';
//import { PrismaClient } from '@prisma/client';
//import fs from 'fs';

const router = express.Router();

router.get('/users/signup', async (req, res) => {
    res.send("Signup route");
});

router.get('/users/login', async (req, res) => {
    res.send("Login route");
});

router.get('/users/logout', async (req, res) => {
    res.send("Logout route");
});


export default router;
