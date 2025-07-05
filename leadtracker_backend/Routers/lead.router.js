import { Router } from "express";
import { addLead, deleteLeadbyId, getAllLeads, getLeadbyEmail, updateLead } from "../controllers/lead.controller.js";


const leadRouter = Router();
//add lead
leadRouter.post("/add-lead",addLead);
// get all lead
leadRouter.get("/get-allleads",getAllLeads);
// get lead by user emal
leadRouter.post("/get-lead-by-email",getLeadbyEmail);
//update lead by id
leadRouter.put("/update-lead/:id",updateLead);
//delete lead by id
leadRouter.delete("/delete-lead/:id",deleteLeadbyId)

export default leadRouter;