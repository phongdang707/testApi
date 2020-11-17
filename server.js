const express = require("express");
// const mongoose = require("mongoose");
const userRouter = require("./routes/api/users/index");

// mongoose
//   .connect("mongodb://localhost:27017/fs05-xedike", {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//   })
//   .then(() => console.log("Connected successfully"))
//   .catch((err) => console.log(err));

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route handler
app.use("/", userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
