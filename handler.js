'use strict';

const app=require('./index')
const serverless=require('serverless-http');
module.exports.incovoice=serverless(app);
