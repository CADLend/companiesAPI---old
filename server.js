/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jihun Yu Student ID: 107890220 Date: Jan-20-2024
*  Cyclic Link: 
*
********************************************************************************/ 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const CompaniesDB = require('./modules/companiesDB.js');

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const db = new CompaniesDB();

const sampleCompanies = [
    {
        "name": "AlphaTech",
        "permalink": "http://example.com/alphatech",
        "crunchbase_url": "http://crunchbase.com/alphatech",
        "homepage_url": "http://www.alphatech.com",
        "blog_url": "http://www.alphatech.com/blog",
        "blog_feed_url": "http://www.alphatech.com/blog/feed",
        "twitter_username": "alphatech",
        "category_code": "tech",
        "number_of_employees": 100,
        "founded_year": 2020,
        "founded_month": 1,
        "founded_day": 1,
        "email_address": "contact@alphatech.com",
        "phone_number": "123-456-7890",
        "description": "A fake company for testing purposes",
        "overview": "Overview of AlphaTech",
        "total_money_raised": "$10M",
        "external_links": []
    },
    {
        "name": "BetaSolutions",
        "permalink": "http://example.com/betasolutions",
        "crunchbase_url": "http://crunchbase.com/betasolutions",
        "homepage_url": "http://www.betasolutions.com",
        "blog_url": "http://www.betasolutions.com/blog",
        "blog_feed_url": "http://www.betasolutions.com/blog/feed",
        "twitter_username": "betasolutions",
        "category_code": "tech",
        "number_of_employees": 100,
        "founded_year": 2020,
        "founded_month": 1,
        "founded_day": 1,
        "email_address": "contact@betasolutions.com",
        "phone_number": "123-456-7890",
        "description": "A fake company for testing purposes",
        "overview": "Overview of BetaSolutions",
        "total_money_raised": "$10M",
        "external_links": []
    },
    {
        "name": "GammaCorp",
        "permalink": "http://example.com/gammacorp",
        "crunchbase_url": "http://crunchbase.com/gammacorp",
        "homepage_url": "http://www.gammacorp.com",
        "blog_url": "http://www.gammacorp.com/blog",
        "blog_feed_url": "http://www.gammacorp.com/blog/feed",
        "twitter_username": "gammacorp",
        "category_code": "tech",
        "number_of_employees": 100,
        "founded_year": 2020,
        "founded_month": 1,
        "founded_day": 1,
        "email_address": "contact@gammacorp.com",
        "phone_number": "123-456-7890",
        "description": "A fake company for testing purposes",
        "overview": "Overview of GammaCorp",
        "total_money_raised": "$10M",
        "external_links": []
    }
]


// JSON parser
app.use(express.json());

app.post('/api/companies', (req, res) => {
    const newCompInfo = req.body;

    db.addNewCompany(newCompInfo)
        .then((newComp) => {
            res.status(201).json(newComp);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message});
        });
});

app.get('/api/companies', (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const name = req.query.name;

    if (isNaN(page) || isNaN(perPage)) {
        return res.status(400).json({ error: "Page and perPage query parameters must be valid numbers"});
    }

    db.getAllCompanies(page, perPage, name)
        .then((companies) => {
            res.json(companies);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message});
        });
});

app.get('/api/company/:id', (req, res) => {
    const companyID = req.params.id;

    db.getCompanyById(companyID)
        .then((company) => {
            if (company) {
                res.json(company); 
            } else {
                res.status(404).json({ msg: `no company found with ID: ${companyID}`});
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message});
        });
});

app.put('/api/company/:id', (req, res) => {
    const companyId = req.params.id;
    const updatedData = req.body;

    db.updateCompanyById(updatedData, companyId)
        .then(updateResult => {
            if (updateResult) {
                res.json(updateResult);
            } else {
                res.status(404).json({ msg: `no company found with ID: ${companyID}`});
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message});
        });
});

app.delete('/api/company/:id', (req, res) => {
    const companyID = req.params.id;

    db.deleteCompanyById(companyID)
        .then((deleteResult) => {
            if (deleteResult.deletedCount > 0) {
                res.status(204).send(); //No content
            } else {
                res.status(404).json({msg: 'Company not found'});
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message});
        });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
