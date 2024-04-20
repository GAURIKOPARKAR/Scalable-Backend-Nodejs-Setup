// require('dotenv').config({path:'/.env'})
import dotenv from "dotenv"
dotenv.config({path:'./.env'})

import connectDatabase from "./db/db.js";

connectDatabase()