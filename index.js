const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = 3000;

// Replace with your bot token
const token = '7105203558:AAGOTuTRp0MdCqpb_tonWJKOeFOXsIWvxac';
const bot = new TelegramBot(token);

// Store user information and states
const userStore = {}; // Stores user info like names
const userState = {}; // Stores user states: 'active', 'inactive', 'help'
const groupChatId = '-1002150245968'; // Replace with your group chat ID

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define the webhook route
app.post(`/bot${token}`, (req, res) => {
  const update = req.body;
  bot.processUpdate(update);
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Set the webhook URL
const webhookUrl = `https://bot-chi-black.vercel.app/bot${token}`;
bot.setWebHook(webhookUrl).then(() => {
  console.log('Webhook set up successfully');
}).catch((error) => {
  console.error('Error setting webhook:', error);
});

// Handle text messages
bot.on('message', (msg) => {
	const chatId = msg.chat.id;
	const userId = msg.from.id;
	const state = userState[userId];
  
	if (msg.chat.type === 'private') {
	  if (state !== 'active') {
		if (msg.text === "/help" || msg.text === "/Help" || msg.text === "/HELP") {
		  userState[userId] = 'help';
  
		  bot.sendMessage(chatId, "Here's how to use this bot:🔻\n\n/start - Start the bot🤖\n/exit - Stop sending messages❌\n/help - Get help information🆘\n\nSend any message after /start to forward it to the group. (t.me/+khPo0Oep5vY2ZDg0)");
		} else if (msg.text === '/exit' || msg.text === "/Exit" || msg.text === "/EXIT") {
		  delete userState[userId];
		  console.log(`User ${userId} has exited`);
  
		  bot.sendMessage(chatId, "You are already exited.\n\nUse /start to resume.🚀");
		} else if (msg.text === "/start" || msg.text === "/Start" || msg.text === "/START") {
		  userState[userId] = 'active';
		  console.log(`User ${userId} is now active`);
  
		  bot.sendMessage(chatId, "Hello! 👋\n\n🇬🇧: Enjoy using this bot to send anonymous messages in your group chats! \n\n🇪🇸: ¡Disfruta usando este bot para enviar mensajes anónimos en tus chats de grupo! \n\n🇫🇷: Amusez-vous à utiliser ce bot pour envoyer des messages anonymes dans vos discussions de groupe! \n\n🇨🇳: 使用这个机器人在群聊中发送匿名消息，尽情享受吧！");
		}
	  } else if (state === 'active') {
		if (msg.text !== "/start" && msg.text !== "/help" && msg.text !== "/exit") {
		  if (!userStore[userId]) {
			userStore[userId] = {
			  name: `user${Object.keys(userStore).length + 1}`
			};
		  }
  
		  const userName = userStore[userId].name;
  
		  bot.sendMessage(groupChatId, `<b>${userName}:</b>\n${msg.text}`, { parse_mode: 'HTML' });
		  bot.sendMessage(chatId, `Message sent as ${userName}.✔ \n\nTo stop sending more messages, type /exit.`);
		}
	  }
	}
  });
  
  // Handle photos
  bot.on('photo', (msg) => {
	const chatId = msg.chat.id;
	const userId = msg.from.id;
	if (msg.chat.type === 'private') {
	  if (userState[userId] === 'active') {
		if (!userStore[userId]) {
		  userStore[userId] = {
			name: `user${Object.keys(userStore).length + 1}`
		  };
		}
		const userName = userStore[userId].name;
  
		const photoId = msg.photo[msg.photo.length - 1].file_id;
  
		bot.sendPhoto(groupChatId, photoId, { caption: `Photo sent by ${userName}` })
		  .then(() => {
			bot.sendMessage(chatId, `Your photo has been forwarded to the channel with the mention: ${userName}.`);
		  })
		  .catch((error) => {
			console.error('Error forwarding photo:', error);
			bot.sendMessage(chatId, "There was an error forwarding your photo. Please try again.");
		  });
	  }
	}
  });
  
  // Handle videos
  bot.on('video', (msg) => {
	const chatId = msg.chat.id;
	const userId = msg.from.id;
  
	if (msg.chat.type === 'private') {
	  if (userState[userId] === 'active') {
		if (!userStore[userId]) {
		  userStore[userId] = {
			name: `user${Object.keys(userStore).length + 1}`
		  };
		}
		const userName = userStore[userId].name;
  
		const videoId = msg.video.file_id;
  
		bot.sendVideo(groupChatId, videoId, { caption: `Video sent by ${userName}` })
		  .then(() => {
			bot.sendMessage(chatId, `Your video has been forwarded to the channel with the mention: ${userName}.`);
		  })
		  .catch((error) => {
			console.error('Error forwarding video:', error);
			bot.sendMessage(chatId, "There was an error forwarding your video. Please try again.");
		  });
	  }
	}
  });
  
  // Handle unknown commands
  bot.onText(/\/(.*)/, (msg, match) => {
	const command = match[1];
	if (!['start', 'help', 'exit'].includes(command)) {
	  const chatId = msg.chat.id;
	  bot.sendMessage(chatId, "Unknown command. 🤷‍♂️ \n\nUse /help for a list of commands.");
	}
  });
  
//   // Error handling
//   bot.on("polling_error", (msg) => console.log(msg));
  