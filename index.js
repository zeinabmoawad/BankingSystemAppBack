import express from "express";
import users from "./Data.js"
import cors from "cors"
import userDataModel from "./models/usersdata.js"
import mongoose from "mongoose";
const app = express();
app.use(express.json());
//not 0->10000
app.listen(8000, () => {
  console.log("zeikkkkkkb");
});
//================================DataBase================================//
mongoose.connect("mongodb://localhost:27017/userData", {
  useNewUrlParser: true,
});
//to check connection
mongoose.connection.on("connected", () => {
  console.log("Connected to DB ");
})

//====================================API=============================/
//=============all Users
app.get("/allusers", async (req, res) => {
  userDataModel.find().then((users, err) => {
    if (err) {
      res.send(err)
    }
    else if (users) {
      res.send({ status: 200, users, message: "users found" })
    }
    else {
      res.send({ status: 401 })
    }
  })
})
//================ specific user
app.get("/findUserByuserName/:userName", async (request, response) => {
  const userName = request.params.userName;

  userDataModel.find({ userName: userName }).then((Userobj,err) => {
    if (err)
      response.send({ err })
    else if (Userobj.length > 0) {
      response.send({ status: 200, Userobj })
    }
    else //not found
      response.send({ status: 404, Message: "User Not Found" })
  })
})
//=======================Transfer
app.post("/Transfer/:User_userName_From/:User_userName_To/:Amount", async (request, response) => {
  // const { User_userName_From, User_userName_To, Amount } = request.bod
  const User_userName_From = request.params.User_userName_From;
  const User_userName_To = request.params.User_userName_To;
  const Amount = request.params.Amount;
  console.log(User_userName_From);
  console.log(User_userName_To);
  console.log(Amount)
  //check if this Workshop exists
  userDataModel.find({ userName: User_userName_From }).then((UserFromObj,err) => {
      if (err)
          response.send({ status: -1, err })
      else if (UserFromObj.length > 0) {

          //get User
          userDataModel.find({  userName: User_userName_To }).then ((UserToObj,err) => {
              if (err)
                  response.send({ status: -1, err })
              else if (UserToObj.length > 0) {
                  var BalanceFrom = UserFromObj[0].balance;
                  var BalanceTo = UserToObj[0].balance;
                  BalanceFrom = BalanceFrom - Number(Amount);
                  BalanceTo = BalanceTo + Number(Amount);
                  // //workshop is OK
                 const Userquery = userDataModel.findOneAndUpdate({  userName: User_userName_From  }, { balance: BalanceFrom }).then((updated,err)=>{
                         if(err){
                              console.log("error");
                          }
                          else{
                              console.log("updated");
                          }
                      })
                  if (Userquery.matchedCount <= 0) {
                      response.send({ status: 404, Message: "No User with this id" })
                      return
                  }
                  const Userquery1 = userDataModel.findOneAndUpdate({ userName: User_userName_To }, { balance: BalanceTo }).then((updated,err)=>{
  
                      if(err){
                          console.log("error");
                      }
                      else{
                          console.log("updated");
                          response.send({ status: 200, Message: "sucess" })

                      }
                      return
                 })
                  if (Userquery1.matchedCount <= 0) {
                      response.send({ status: 404, Message: "No User with this id" })
                      console.log("user 2");

                      return
                 }
              }
              else
              {
                  console.log(UserToObj);
                  response.send({ status: 404, Message: "User not Found to transfer to Him" })
              }

          });
      
        }
      else //not found
          response.send({ status: 404, Message: "User not Found to transfer from Him" })
  })
})
