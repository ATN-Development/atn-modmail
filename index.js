// Requiring NPM packages.
const Eris = require('eris')
const fs = require('fs')
const { Client } = require('yuuko')
const path = require('path')

// Defining the client
const client = new Client({
  allowMention: true,
  allowedMentions: true,
  autoreconnect: true,
  caseSensitiveCommands: false,
  caseSensitivePrefix: false,
  getAllUsers: true,
  ignoreBots: true,
  prefix: '=',
  token: process.env.TOKEN
})

// Adding commands and events folder.
client.addDir(path.join(__dirname, 'commands'))
client.addDir(path.join(__dirname, 'events'))

// Requiring server file to get the bot online 24/7 as I'm poor to get a decent host.
require('./server')()

// Editing the status of the bot.
client.editStatus('online', {
  name: 'your ModMails!',
  type: 2
})

// Connecting to Discord.
client.connect()