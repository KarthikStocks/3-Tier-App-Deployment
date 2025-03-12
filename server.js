const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
const JWTSecret = process.env.JWT_SECRET;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
// app.use("/karthik", express.static("profilePics"));
// /profilePics\1740056389138_P_pic.png
// /karthik\1740056389138_P_pic.png

// app.use("/sachin", express.static("profilePics"));
// /sachin\1740056389138_P_pic.png

app.use("/profilePics", express.static("profilePics"));
// /profilePics\1740056389138_P_pic.png

app.use(express.static(path.join(__dirname, "./client/build")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilePics");
  },
  filename: function (req, file, cb) {
    console.log(file);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    // cb(null, file.originalname);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("users", userSchema, "users");

let connectTOMDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("Successfully connected to MDB 😃");
  } catch (err) {
    console.log("Unable to connect to MDB 😞");
  }
};

connectTOMDB();

app.get("*", (req, res) => {
  res.sendFile("./client/build/index.html");
});

app.post("/signUp", upload.single("profilePic"), async (req, res) => {
  // app.post("/signUp", upload.none(), async (req, res) => {
  // app.post("/signUp", upload.array("profilePic"), async (req, res) => {
  console.log("Inside signUp");
  console.log(req.body);
  // console.log(req.files); - upload.array
  console.log(req.file); // upload.single

  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    let newSignUp = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      // password: req.body.password,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
      //   profilePic: req.files.path,
      profilePic: req.file.path,
    });

    await newSignUp.save();

    console.log("New User Saved Successfully 😃");
    res.json({ status: "success", msg: "User Created Successfully 😃" });
  } catch (err) {
    console.log("Unable to save user 😞");
    res.json({ status: "failure", msg: "Unable to create User 😞." });
  }
});

// app.put();
app.patch("/updateProfile", upload.single("profilePic"), async (req, res) => {
  console.log("Received details for update");
  console.log(req.body);

  if (req.body.firstName.trim().length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { firstName: req.body.firstName }
    );
  }

  if (req.body.lastName.trim().length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { lastName: req.body.lastName }
    );
  }

  if (req.body.age > 0) {
    await User.updateMany({ email: req.body.email }, { age: req.body.age });
  }

  if (req.body.password.length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { password: req.body.password }
    );
  }

  if (req.body.mobileNo.trim().length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { mobileNo: req.body.mobileNo }
    );
  }

  if (req.file) {
    await User.updateMany(
      { email: req.body.email },
      { profilePic: req.file.path }
    );
  }

  res.json({ status: "success", msg: "Profile updated successfully." });
});

app.delete("/deleteProfile", async (req, res) => {
  console.log(req.query);

  let response = await User.deleteMany({ email: req.query.email });
  console.log(response);

  if (response.deletedCount > 0) {
    res.json({ status: "success", msg: "User deleted successfully" });
  } else {
    res.json({ status: "failure", msg: "User wasn't deleted" });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  console.log("/Inside Login");
  let userDataArr = await User.find().and([{ email: req.body.email }]);

  if (userDataArr.length > 0) {
    let isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      userDataArr[0].password
    );

    // if (userDataArr[0].password == req.body.password) {
    if (isPasswordCorrect == true) {
      let token = jwt.sign(
        {
          email: req.body.email,
          password: req.body.password,
        },
        JWTSecret
      );

      let userDetails = {
        firstName: userDataArr[0].firstName,
        lastName: userDataArr[0].lastName,
        age: userDataArr[0].age,
        email: userDataArr[0].email,
        mobileNo: userDataArr[0].mobileNo,
        profilePic: userDataArr[0].profilePic,
        token: token,
      };

      res.json({
        status: "success",
        msg: "Successfully logged in.",
        // data: userDataArr[0],
        data: userDetails,
      });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User does not exist." });
  }
  console.log(userDataArr);
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log("Inside validateToken");
  console.log(req.body.token);

  let decryptedToken = jwt.verify(req.body.token, JWTSecret);
  console.log(decryptedToken);

  let userDataArr = await User.find().and([{ email: decryptedToken.email }]);

  if (userDataArr.length > 0) {
    if (userDataArr[0].password == decryptedToken.password) {
      // let token = jwt.sign(
      //   {
      //     email: req.body.email,
      //     password: req.body.password,
      //   },
      //   "abcd"
      // );

      let userDetails = {
        firstName: userDataArr[0].firstName,
        lastName: userDataArr[0].lastName,
        age: userDataArr[0].age,
        email: userDataArr[0].email,
        mobileNo: userDataArr[0].mobileNo,
        profilePic: userDataArr[0].profilePic,
        // token: token,
      };

      res.json({
        status: "success",
        msg: "Successfully logged in.",
        // data: userDataArr[0],
        data: userDetails,
      });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User does not exist." });
  }
});

app.listen(4567, () => {
  console.log("Listening to port 4567...");
});
