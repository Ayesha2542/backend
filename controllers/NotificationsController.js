const customReferences = require("../references/customReferences");
const notificationModel=require("../model/notificationModel");
// API endpoint to send a notification
customReferences.app.post('/sendNotification', async (req, res) => {
    try {
      const { title, body, userId } = req.body;
  
      // Save notification to MongoDB
      const newNotification = new notificationModel({ title, body, userId });
      await newNotification.save();
  
      res.json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
