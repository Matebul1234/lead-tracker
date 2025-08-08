import {Router} from "express";
import { addcustomer, getAllCustomer } from "../controllers/customer.controller.js";


const customerRouter = Router();

// add customer 
customerRouter.post("/add-customer",addcustomer);

// get all customers
customerRouter.get("/get-all-customer",getAllCustomer);



export default customerRouter;

