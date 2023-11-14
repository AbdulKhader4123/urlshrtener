const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors({
  origin: '*'
}));
mongoose.connect(`mongodb+srv://abuka:${process.env.passkey}@cluster0.ltdpswl.mongodb.net/`, {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.urlencoded({ extended: false }))

app.get('/urls', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 1;
  delete req.query.limit;
  delete req.query.offset;
  const filter = req.query || {};
  const shortUrls = await ShortUrl.find(filter, {'full':1, 'short':1, "createdAt": 1, "_id": 0})
  .skip(limit * offset - limit)
  .limit(limit)
  .sort({createdAt: -1})
  const totalCount = await ShortUrl.countDocuments(filter);
  res.send({ totalCount, shortUrls });
})

app.post('/urls', async (req, res) => {
  const shortUrl = await ShortUrl.create({ full: req?.body?.fullUrl, userId:req?.body?.userId })
  if (shortUrl == null) return res.sendStatus(400)
  res.sendStatus(200)
})

app.get('/urls/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req?.params?.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)
  res.redirect(shortUrl.full)
})

app.delete('/urls/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.deleteOne({ short: req?.params?.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)
  res.sendStatus(200)
})

app.listen(process.env.PORT || 5000);