import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: passwordHash, avatarURL: gravatar.url(email) });
    res.status(201).send({ user: {email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL} });

  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    res.status(200).send({ user: {email: user.email, subscription: user.subscription}, token });
} catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {

   try {

    await User.findByIdAndUpdate(req.user.userId, { token: null }, { new: true });
    console.log(req.user.userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res.status(200).send({email: user.email, subscription: user.subscription});
  } catch (error) {
    next(error);
  }
}

async function updateSubscription(req, res, next) {
  
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
    res.status(200).send({ user: {email: user.email, subscription: user.subscription} });
  } catch (error) {
    next(error);
  }
}



export default { register, login, logout, getCurrentUser, updateSubscription };