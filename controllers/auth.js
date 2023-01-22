const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

//require('dotenv').config(); //agar na chle toh index.js se ye line hata kr dekhna

// const api_key = process.env.STREAM_API_KEY;
// const api_secret = process.env.STREAM_API_SECRET;
// const app_id = process.env.STREAM_APP_ID;

const api_key = '7e4k8bm8r9k8';
const api_secret = '5ygxfdez8bhtze4s5zm3x7jjsqf7xzu8j97cr7pgestad58hxqzx93wy6du3b64k';
const app_id = "1203387";


const signup = async (req, res) => {

    try {
        const { fullName, username, password, phoneNumber } = req.body;
        const userId = crypto.randomBytes(16).toString('hex');
        console.log("yaha tk")
        const serverClient = connect(api_key, api_secret, app_id);
        console.log("yaha tkk")
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("yaha tkk bhi")
        const token = serverClient.createUserToken(userId);
        console.log("yaha tkk bhi yrr")
        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
    }
    catch (error) {
        console.log("idrrrrr")
        console.log(error);
        res.status(500).json({ message: error });
    }

};

const login = async (req, res) => {
    console.log("idddrrrrrrrr hari bol")
    try {
        console.log("yahahahaha hari")
        const { username, password } = req.body;
        console.log(username)
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        console.log(req.body);
        const { users } = await client.queryUsers({ name: username });
        console.log(users);
        if (!users.length) { return res.status(400).json({ message: 'User not found' }); }

        const success = await bcrypt.compare(password, users[0].hashedPassword);
        const token = serverClient.createUserToken(users[0].id);

        if (success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        }
        else {
            res.status(500).json({ message: "Incorrect password" });
        }
    }
    catch (error) {
        console.log(e);
        res.status(500).json({ message: error });
    }

};

module.exports = { signup, login };