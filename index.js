const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // For environment variables

const app = express();
const port = 3000;

// Use environment variables to store sensitive information
const token = '7105203558:AAGOTuTRp0MdCqpb_tonWJKOeFOXsIWvxac';
const webhookUrl = `https://bot-chi-black.vercel.app/${token}`; // Replace with your actual domain

const bot = new TelegramBot(token);

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the webhook route
app.post(`/bot${token}`, (req, res) => {
    res.sendStatus(200);
    const update = req.body;
    bot.processUpdate(update);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    // Set the webhook URL only once when the server starts
    bot.setWebHook(webhookUrl).then(() => {
        console.log('Webhook set up successfully');
    }).catch((error) => {
        console.error('Error setting webhook:', error);
    });
});

// Handle text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
        Hello! 👋
        \n\n🇬🇧: Enjoy using this bot to send anonymous messages in your group chats!
        \n\n🇪🇸: ¡Disfruta usando este bot para enviar mensajes anónimos en tus chats de grupo!
        \n\n🇫🇷: Amusez-vous à utiliser ce bot pour envoyer des messages anonymes dans vos discussions de groupe!
        \n\n🇨🇳: 使用这个机器人在群聊中发送匿名消息，尽情享受吧！
    `;

    bot.sendMessage(chatId, welcomeMessage);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const TelegramBot = require('node-telegram-bot-api');

// const app = express();
// const port = 3000;

// // Replace with your bot token
// const token = '7105203558:AAGOTuTRp0MdCqpb_tonWJKOeFOXsIWvxac';
// const bot = new TelegramBot(token);

// // Store user information and states
// const userStore = {}; // Stores user info like names
// const userState = {}; // Stores user states: 'active', 'inactive', 'help'
// const groupChatId = '-1002150245968'; // Replace with your group chat ID

// // Middleware to parse JSON request bodies
// app.use(bodyParser.json());

// // Define the webhook route
// app.post(`/bot${token}`, (req, res) => {
// 	res.sendStatus(200);
// 	const update = req.body;
//   bot.processUpdate(update);
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // Set the webhook URL
// const webhookUrl = `https://bot-chi-black.vercel.app/bot${token}`;
// bot.setWebHook(webhookUrl).then(() => {
//   console.log('Webhook set up successfully');
// }).catch((error) => {
//   console.error('Error setting webhook:', error);
// });

// // Handle text messages
// bot.on('message', (msg) => {
// 	const chatId = msg.chat.id;
	
// 		  bot.sendMessage(chatId, "Hello! 👋\n\n🇬🇧: Enjoy using this bot to send anonymous messages in your group chats! \n\n🇪🇸: ¡Disfruta usando este bot para enviar mensajes anónimos en tus chats de grupo! \n\n🇫🇷: Amusez-vous à utiliser ce bot pour envoyer des messages anonymes dans vos discussions de groupe! \n\n🇨🇳: 使用这个机器人在群聊中发送匿名消息，尽情享受吧！");
	
//   });
  
//   // Handle photos
//   bot.on('photo', (msg) => {
// 	const chatId = msg.chat.id;
// 	const userId = msg.from.id;
// 	if (msg.chat.type === 'private') {
// 	  if (userState[userId] === 'active') {
// 		if (!userStore[userId]) {
// 		  userStore[userId] = {
// 			name: `user${Object.keys(userStore).length + 1}`
// 		  };
// 		}
// 		const userName = userStore[userId].name;
  
// 		const photoId = msg.photo[msg.photo.length - 1].file_id;
  
// 		bot.sendPhoto(groupChatId, photoId, { caption: `Photo sent by ${userName}` })
// 		  .then(() => {
// 			bot.sendMessage(chatId, `Your photo has been forwarded to the channel with the mention: ${userName}.`);
// 		  })
// 		  .catch((error) => {
// 			console.error('Error forwarding photo:', error);
// 			bot.sendMessage(chatId, "There was an error forwarding your photo. Please try again.");
// 		  });
// 	  }
// 	}
//   });
  
//   // Handle videos
//   bot.on('video', (msg) => {
// 	const chatId = msg.chat.id;
// 	const userId = msg.from.id;
  
// 	if (msg.chat.type === 'private') {
// 	  if (userState[userId] === 'active') {
// 		if (!userStore[userId]) {
// 		  userStore[userId] = {
// 			name: `user${Object.keys(userStore).length + 1}`
// 		  };
// 		}
// 		const userName = userStore[userId].name;
  
// 		const videoId = msg.video.file_id;
  
// 		bot.sendVideo(groupChatId, videoId, { caption: `Video sent by ${userName}` })
// 		  .then(() => {
// 			bot.sendMessage(chatId, `Your video has been forwarded to the channel with the mention: ${userName}.`);
// 		  })
// 		  .catch((error) => {
// 			console.error('Error forwarding video:', error);
// 			bot.sendMessage(chatId, "There was an error forwarding your video. Please try again.");
// 		  });
// 	  }
// 	}
//   });
  
//   // Handle unknown commands
//   bot.onText(/\/(.*)/, (msg, match) => {
// 	const command = match[1];
// 	if (!['start', 'help', 'exit'].includes(command)) {
// 	  const chatId = msg.chat.id;
// 	  bot.sendMessage(chatId, "Unknown command. 🤷‍♂️ \n\nUse /help for a list of commands.");
// 	}
//   });
  
//   // Error handling
//   bot.on("polling_error", (msg) => console.log(msg));
  