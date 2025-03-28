require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

app.use(cors());
app.use(express.json());

app.post("/generate-responses", async (req, res) => {
    const { questions, resume } = req.body;

    if (!questions || !resume) {
        return res.status(400).json({ error: "Missing questions or resume." });
    }

    try {
        const responses = await Promise.all(
            questions.map(async (question) => {
                const response = await axios.post(
                    "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder",
                    { inputs: `${question}\n\n${resume}` },
                    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
                );
                return response.data;
            })
        );
        res.json({ responses });
    } catch (error) {
        res.status(500).json({ error: "Error generating responses." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

