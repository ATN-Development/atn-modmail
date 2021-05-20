// Requiring NPM packages.
const Eris = require('eris')
const fs = require('fs')
const { Client } = require('yuuko')
const path = require('path')
const { Prefix, Token } = require('./config')

// Defining the client
const client = new Client({
  allowMention: true,
  allowedMentions: true,
  autoreconnect: true,
  caseSensitiveCommands: false,
  caseSensitivePrefix: false,
  getAllUsers: true,
  ignoreBots: true,
  prefix: Prefix,
  token: Token
})

// Adding commands and events folder.
client.addDir(path.join(__dirname, 'commands'))
client.addDir(path.join(__dirname, 'events'))

// Editing the status of the bot.
client.editStatus('online', { // Tip: Choose between online, idle, dnd or offline
  name: 'your ModMails!', // The message that comes after watching, listening, or playing
  type: 2 // The type of the status, read https://abal.moe/Eris/docs/Client#method-editStatus for more information
})

// Connecting to Discord.
client.connect()