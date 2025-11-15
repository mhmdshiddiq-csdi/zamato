const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodPartner.model');
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const isUserExists = await userModel.findOne({
    email
  })

  if(isUserExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword
  })

  const token = jwt.sign({
    id: user._id, 
  }, process.env.JWT_SECRET)
  res.cookie("token", token)
  res.status(201).json({
    message: "User registered successfully", user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email
  } });
  
}

const loginUser = async (req, res) => { 
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) { 
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) { 
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET)

  res.cookie("token", token)
  res.status(200).json({message: "User logged in successfully", user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email
  } });
}

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({message: "User logged out successfully"});
}

const registerFoodPartner = async (req, res) => {
  const { name, email, password } = req.body;

  const isAccountAlreadyExists = await foodPartnerModel.findOne({
    email
  })
  if (isAccountAlreadyExists) { 
    return res.status(400).json({ message: "Account already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword
  })

  const token = jwt.sign({
    id: foodPartner._id
  }, process.env.JWT_SECRET)

  res.cookie("token", token)
  res.status(201).json({
    message: "Food partner registered successfully", foodPartner: {
      id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email
  } });
}

async function loginFoodPartner(req, res) { 
  const { email, password } = req.body;
  const foodPartner = await foodPartnerModel.findOne({ email });
  if (!foodPartner) { 
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
  if (!isPasswordValid) { 
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({
    id: foodPartner._id
  }, process.env.JWT_SECRET)

  res.cookie("token", token)
  res.status(200).json({message: "Food partner logged in successfully", foodPartner: {
    id: foodPartner._id,
    name: foodPartner.name,
    email: foodPartner.email
  } });
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({message: "Food partner logged out successfully"});
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
}