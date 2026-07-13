// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thishthat5065@gmail.com",
    pass: "ffqm ouom dtrf gmgs"
  },
});

app.post("/auth/user/register", async (req, res) => {
  const { name, email, contact, password } = req.body;

  try {
    // Mock database logic (replace with your DB logic)
    console.log("User data saved:", { name, email, contact, password });

    // Send email
    const mailOptions = {
      from: "thishthat5065@gmail.com",
      to: email,
      subject: "Welcome to Our Service",
      text: `Hi ${name},\n\nThank you for signing up!\n\nBest regards,\nYour Service Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.status(201).json({ message: "User registered successfully." });
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
