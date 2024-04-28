import express from "express";
import { produceMessageToKafka } from "../controllers/producerController.js";

const router = express.Router();

// Route for posting messages
router.post("/", async (req, res) => {
  try {
    const message = JSON.stringify(req.body);
    await produceMessageToKafka(message);
    res.send("Message sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message");
  }
});

export { router };
