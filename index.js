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

// Connecting to Discord.
client.connect()