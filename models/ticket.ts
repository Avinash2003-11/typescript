import mongoose  from "mongoose";

const ticketschema = new mongoose.Schema({
    name: {type: String, required: true},
    employeeId: {type: Number, required: true},
    problem: {type:String, required: true},
    ticketcreatedat: {type:Date, default:Date.now}



})

const ticketmodel = mongoose.model("ticket", ticketschema)
export default ticketmodel;