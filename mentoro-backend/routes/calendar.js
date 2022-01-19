const express = require('express');
const router = express.Router();
const {google} = require("googleapis");
const User = require("../models/user")

const oauth2client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    process.env.fehost
)

router.post("/add-event",async(req,res)=>{
  try {
    const calendar = google.calendar("v3");
    const {mentorId,userId,startTime,endTime,title} = req.body;
    const user = await User.findOne({_id:userId});
    const mentor = await User.findOne({_id:mentorId});

    var event = {
        'summary': title,
        'start': {
          'dateTime': startTime
        },
        'end': {
          'dateTime': endTime
        },
        'attendees': [
          {'email': user.email},
          {'email': mentor.email},
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
          ],
        },
    };

    oauth2client.setCredentials({refresh_token:mentor.refreshToken})
    calendar.events.insert({
      auth: oauth2client,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: ', event);
      res.send({eventId: event.data.id})
    });
    
  } catch (error) {
      console.log(error);
      res.status(500).send(error);
  }
})


module.exports = router;