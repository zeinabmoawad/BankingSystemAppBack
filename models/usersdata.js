//======================================to use mongo functions=====================//
import mongoose from "mongoose";
const userDataSchema = mongoose.Schema({
     username: {
        type: String,
        // default: "task"
    },
    name: {
        type: String,
        default: "task"
    },  
    email: {
        type: String,
        //default: ""
    },
    phone: {
        type: String,
        //default: ""
    },
    balance: {
        type: Number,
        //default: ""

    }
})
const userDataModel=mongoose.model("userData",userDataSchema);
export default userDataModel;