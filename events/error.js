const { EventListener } = require('yuuko')

module.exports = new EventListener('error', async (err, id) => {
  console.log(err)
})