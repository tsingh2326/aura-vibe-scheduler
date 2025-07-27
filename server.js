const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: 'taarisingh2005@gmail.com',
  pass: 'Makdi12345!' // Note: If using 2FA, this should be an app password instead of your regular password
  }
});

// Helper function to send emails
const sendInvitationEmail = (participant, eventId) => {
  const mailOptions = {
    from: 'taarisingh2005@gmail.com',
    to: participant.email,
    subject: 'Event Invitation - Please Submit Your Availability',
    html: `
      <h2>You've been invited to "${participant.eventTitle}"</h2>
      <p>Please click the button below to submit your availability:</p>
      <a href="http://localhost:8080/availability/${eventId}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Submit Availability
      </a>
      <p>This link will allow you to select your preferred time slots for the event.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// API endpoint to create event
app.post('/api/events', (req, res) => {
  const eventData = req.body;
  const eventId = Date.now().toString();
  
  // Save event data to file
  const filePath = path.join(dataDir, `${eventId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(eventData, null, 2));
  
  // Send emails to all participants
  eventData.participants.forEach(participant => {
    if (participant.email) {
      sendInvitationEmail({...participant, eventTitle: eventData.title}, eventId);
    }
  });
  
  res.status(201).json({ 
    id: eventId,
    message: 'Event created successfully and invitations sent'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Data directory:', dataDir);
});
