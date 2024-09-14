const TelegramBot = require('node-telegram-bot-api');
const token = '7013297460:AAHXBvovHdU0NwKlOMXiXom7g5c1gMToKXU';
const bot = new TelegramBot(token, { polling: true });

// Store user information and states
const userStore = {}; // Stores user info like names
const userState = {}; // Stores user states: 'active', 'inactive', 'help'

// Group chat ID
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (msg.chat.type === 'private') {
    // Delay message processing to ensure state changes are handled
    // Check the user's state
    const state = userState[userId];

    if (state !== 'active') {
      if (msg.text === "/help" || msg.text === "/Help" || msg.text === "/HELP") {
        userState[userId] = 'help';

        bot.sendMessage(chatId, "Here's how to use this bot:🔻\n\n/start - Start the bot🤖\n/exit - Stop sending messages❌\n/help - Get help information🆘\n\nSend any message after /start to forward it to the group. (t.me/+khPo0Oep5vY2ZDg0)");

      } else if (msg.text === '/exit' || msg.text === "/Exit" || msg.text === "/EXIT") {
        delete userState[userId];
        console.log(`User ${userId} has exited`);

        bot.sendMessage(chatId, "You are already exited.\n\nUse /start to resume.🚀");
      } else if (msg.text === "/start" || msg.text === "/Start" || msg.text === "/START") {
        // Set user state to active
        userState[userId] = 'active';
  
        bot.sendMessage(chatId, "Hello! 👋\n\n🇬🇧: Enjoy using this bot to send anonymous messages in your group chats! \n\n🇪🇸: ¡Disfruta usando este bot para enviar mensajes anónimos en tus chats de grupo! \n\n🇫🇷: Amusez-vous à utiliser ce bot pour envoyer des messages anonymes dans vos discussions de groupe! \n\n🇨🇳: 使用这个机器人在群聊中发送匿名消息，尽情享受吧！");
  
        if (channels.length === 0) {
          bot.sendMessage(chatId, 'No channels available.');
          return;
        }
  
        const keyboard = channels.map(channel => [
          {
            text: channel.title,
            callback_data: `menu1_channel_${channel.id}`
          }
        ]);
  
        bot.sendMessage(chatId, 'Select a channel from Menu to activate the bot on it:', {
          reply_markup: {
            inline_keyboard: keyboard
          }
        });
      }
    }
  }
});

let channels = []; // Array to store channels

bot.on('my_chat_member', (update) => {
  if (update.new_chat_member.status === 'administrator' && update.chat.type === 'channel') {
    const channelId = update.chat.id;
    const channelTitle = update.chat.title;

    if (!channels.find(channel => channel.id === channelId)) {
      channels.push({ id: channelId, title: channelTitle });
    }
  }
});



// Handle callback queries from Menu 1
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const userId = callbackQuery.from.id;

  if (data.startsWith('menu1_channel_')) {
    const channelId = data.replace('menu1_channel_', '');
    const channel = channels.find(c => c.id === parseInt(channelId, 10));

    if (channel) {
      // Store the selected group ID in userStore
      if (!userStore[userId]) {
        userStore[userId] = {};
      }
      userStore[userId].groupChatId = channelId;

      bot.sendMessage(chatId, `Bot will now work on: ${channel.title}`);
    } else {
      bot.sendMessage(chatId, 'Channel not found.');
    }
  } 
  
});



bot.on('message', (msg) => {
  if (msg.text) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (msg.chat.type === 'private') {
      const state = userState[userId];
      const userGroupChatId = userStore[userId]?.groupChatId;

      if (state === 'active' && userGroupChatId !== null) {
        if (msg.text === "/help") {
          userState[userId] = 'help';

          bot.sendMessage(chatId, "Here's how to use this bot:🔻\n\n/start - Start the bot🤖\n/exit - Stop sending messages❌\n/help - Get help information🆘\n\nSend any message after /start to forward it to the group. (t.me/+khPo0Oep5vY2ZDg0)");

        } else if (msg.text === '/exit') {
          delete userState[userId];
          bot.sendMessage(chatId, "You have exited.◀ \n\nUse /start to resume.");
        } else if (msg.text != "/start") {
          if (!userStore[userId].name) {
            userStore[userId].name = `user${Object.keys(userStore).length + 1}`
            
          }

          const userName = userStore[userId].name;
          bot.sendMessage(userGroupChatId, `<b>${userName}:</b>\n${msg.text}`, { parse_mode: 'HTML' });
          bot.sendMessage(chatId, `Message sent as ${userName}.✔ \n\nTo stop sending more messages, type /exit.`);
        }
      }
    }
  }
});


bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (msg.chat.type === 'private') {

    const state = userState[userId];
    const userGroupChatId = userStore[userId]?.groupChatId;

    if (state === 'active' && userGroupChatId !== null) {
      if (!userStore[userId]) {
        userStore[userId] = {
          name: `user${Object.keys(userStore).length + 1}`
        };
      }
      const userName = userStore[userId].name;

      const photoId = msg.photo[msg.photo.length - 1].file_id;

      bot.sendPhoto(userGroupChatId, photoId, { caption: `Photo sent by ${userName}` })
        .then(() => {
          bot.sendMessage(chatId, `Your photo has been forwarded to the channel with the mention: ${userName}.`);
        })
        .catch((error) => {
          bot.sendMessage(chatId, "There was an error forwarding your photo. Please try again.");
        });
    }
  }
});

bot.on('video', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (msg.chat.type === 'private') {
    const state = userState[userId];
    const userGroupChatId = userStore[userId]?.groupChatId;

    if (state === 'active' && userGroupChatId !== null) {
      if (!userStore[userId]) {
        userStore[userId] = {
          name: `user${Object.keys(userStore).length + 1}`
        };
      }
      const userName = userStore[userId].name;

      const videoId = msg.video.file_id;

      bot.sendVideo(userGroupChatId, videoId, { caption: `Video sent by ${userName}` })
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

console.log(userStore)
console.log(userState)
// Error handling
bot.on("polling_error", (msg) => console.log(msg));
