const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const cors = require('cors');
const app = express();

//App Setup 
app.use(morgan('combined'));
app.use(cors());
//app.use(require('body-parser').urlencoded({extended:true}));
app.use(bodyParser.json({type:'*/*'}));
router(app);
//Server Setup
const port = process.env.Port || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is listening to port:',port);