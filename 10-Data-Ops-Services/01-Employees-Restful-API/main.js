import { MongoClient } from "mongodb";
import express from "express";

// create an express application object
const app = express();

const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI);
let database, collection;

const server = app.listen;
