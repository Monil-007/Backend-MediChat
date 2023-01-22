const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require("./routes/auth.js");

const app = express();


require('dotenv').config();

const accountSid = 'AC1fff1870c8dd22a56e13ddb18e81e556';
const authToken = 'de2c00368176b4c63b25f145d0a2c170';
const messagingServiceSid = 'MG754f4652893495398f393a0be64e651d';
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Radhe-krishna");
});



app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if (type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if (!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            })

        return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        function (err) {
            res.status(500).send(err);
        }
    );
});
app.listen(port, () => { console.log(`server started running!!! !!`) });