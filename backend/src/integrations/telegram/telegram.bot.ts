import TelegramBot from 'node-telegram-bot-api';
import process from 'node:process';

export const bot = new TelegramBot(process.env.BOT_TOKEN!, {
  polling: false
});
