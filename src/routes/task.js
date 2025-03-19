const express = require("express");
const validator = require("validator");
const Task = require("../models/task");
const authenticate = require("../middlewares/auth");
const taskScheduler = require("../utils/taskScheduler");

const router = express.Router();

// ✅ Create Task
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Input validation using validator.js
    if (!title || !validator.isLength(title, { min: 3 })) {
      return res
        .status(400)
        .json({ message: "Title must be at least 3 characters long" });
    }
    if (description && !validator.isLength(description, { min: 5 })) {
      return res
        .status(400)
        .json({ message: "Description must be at least 5 characters long" });
    }
    if (!["pending", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'pending' or 'completed'" });
    }
    if (!["low", "medium", "high"].includes(priority)) {
      return res
        .status(400)
        .json({ message: "Priority must be 'low', 'medium', or 'high'" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      userId: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get All Tasks (with Pagination & Filtering)
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = "1", limit = "10", priority, status } = req.query;

    // Validate query parameters
    if (!validator.isInt(page, { min: 1 })) {
      return res
        .status(400)
        .json({ message: "Page must be a positive integer" });
    }
    if (!validator.isInt(limit, { min: 1 })) {
      return res
        .status(400)
        .json({ message: "Limit must be a positive integer" });
    }
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority filter" });
    }
    if (status && !["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const query = { userId: req.userId };
    if (priority) query.priority = priority;
    if (status) query.status = status;

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / parseInt(limit));

    const tasks = await Task.find(query)
      .sort({ priority: 1, createdAt: 1 }) // Sorting tasks (low priority to high)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      currentPage: parseInt(page),
      totalPages,
      totalTasks,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/schedule", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(taskScheduler(tasks));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get a Single Task by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ Update Task by ID
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Validate inputs (if provided)
    const updateFields = {};
    if (title && !validator.isLength(title, { min: 3 })) {
      return res
        .status(400)
        .json({ message: "Title must be at least 3 characters long" });
    }
    if (description && !validator.isLength(description, { min: 5 })) {
      return res
        .status(400)
        .json({ message: "Description must be at least 5 characters long" });
    }
    if (status && !["pending", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'pending' or 'completed'" });
    }
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res
        .status(400)
        .json({ message: "Priority must be 'low', 'medium', or 'high'" });
    }

    // Construct update fields object
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete Task by ID
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
