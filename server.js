const app = require('express')
const path = require('path')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

module.exports = () => {
  app.listen(3000)
}