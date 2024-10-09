import { User, Thought } from "../models/index.js";

export const getAllThoughts = async (_req, res) => {
  try {
    const thoughts = await Thought.find();

    res.json(thoughts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getThoughtById = async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId);
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const addThoughtToUser = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: thought._id } },
      { new: true }
    );
    res.json(addThoughtToUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });

    if (!thought) {
      return res.status(404).json({ message: "No such thought exists" });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Thought deleted, but no user found",
      });
    }

    return res.json({ message: "Thought successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const addReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: "No thought found with that ID :(" });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const removeReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: "No thought found with that ID :(" });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
};
