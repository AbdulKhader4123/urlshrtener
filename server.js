const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
mongoose.connect(`mongodb+srv://abuka:${process.env.passkey}@cluster0.ltdpswl.mongodb.net/`, {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/urls', async (req, res) => {
  const shortUrls = await ShortUrl.find({},{'full':1, 'short':1, "createdAt": 1, "_id": 0})
  res.send(shortUrls)
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  const shortUrls = await ShortUrl.find({},{'full':1, 'short':1,"createdAt": 1, "_id": 0})
  res.send(shortUrls)
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);