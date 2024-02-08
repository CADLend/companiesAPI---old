/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jihun Yu Student ID: 107890220 Date: Feb-07-2024
*  Cyclic Link: https://energetic-sundress-deer.cyclic.app/
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

// JSON parser
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Default route (\'/\')");
    res.sendFile(path.join(__dirname, 'solution', 'index.html'));
})

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
