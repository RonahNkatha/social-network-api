import { ObjectId } from "mongodb";
import { User, Thought } from "../models/index.js";

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().populate("thoughts").select("-__v");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .select("-__v")
      .populate("thoughts")
      .populate("friends");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    return res.json({ message: "User successfully updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.userId,
    });

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    const thought = await Thought.findOneAndUpdate(
      { users: req.params.userId },
      { $pull: { users: req.params.userId } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({
        message: "User deleted, but no thoughts found",
      });
    }

    return res.json({ message: "User successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const addUser = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.studentId },
      { $addToSet: { assignments: req.body } },
      { runValidators: true, new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "No student found with that ID :(" });
    }

    return res.json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const removeUser = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.studentId },
      { $pull: { assignments: { assignmentId: req.params.assignmentId } } },
      { runValidators: true, new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "No student found with that ID :(" });
    }

    return res.json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addFriend = async (req, res) => {
  try {
    const friend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );
    if (!friend) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }
    return res.json(friend);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const removeFriend = async (req, res) => {
  try {
    const friend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );
    if (!friend) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }
    return res.json(friend);
  } catch (err) {
    return res.status(500).json(err);
  }
};
