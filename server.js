import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Database Connection
async function connectDb() {
  await mongoose.connect("mongodb://mongodb:27017/note_data");
  console.log("Db connected");
}

// Note Schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", noteSchema);

// Home Route
app.get("/", (req, res) => {
  return res.json({
    message: "Welcome to home page",
  });
});
app.get("/checking_pipeline", (req, res) => {
  return res.json({
    message: "This is new route for checking working of CI/CD",
  });
});

// Health Check
app.get("/health", (req, res) => {
  return res.json({
    message: "App is working fine and updated and updated using CI/CD of ECR",
  });
});

// Create Note
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
    });

    return res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();

    return res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Note
app.put("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Note
app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Server Start
async function init() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`App is listening at port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

init();
