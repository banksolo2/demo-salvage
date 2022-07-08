const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { process_params } = require('express/lib/router');
const session = require('express-session');
const { v4: uuidv4} = require('uuid');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const {isRole} = require('./functions/role');
const fileUpload = require('express-fileupload');




//Static files
app.use(express.static('public'));

//backend files
app.use('/backend', express.static(`${__dirname} public/backend`));
// frontend files
app.use('/frontend', express.static(`${__dirname} public/frontend`));
// file Upload
app.use(fileUpload());

//upload
app.use('/upload', express.static(`${__dirname} public/upload`));







// add session
app.use(session({
    secret : uuidv4(),
    resave : false,
    saveUninitialized : true
}));


//middleware 
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//set template engine
app.use(expressLayouts);
app.set('layout','./layouts/backend');
app.set('view engine', 'ejs');


//routes
const frontend = require('./server/routes/frontend');
app.use('/',frontend);

const backend = require('./server/routes/backend');
const req = require('express/lib/request');
app.use('/auth',backend);






app.listen(port,()=> console.log(`Server running at: http://localhost:${port}`));
