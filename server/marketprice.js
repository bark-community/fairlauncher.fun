const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.get('/price', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bark&vs_currencies=usd')
    const price = response.data.bark.usd
    res.json({ price })
  } catch (error) {
    console.error('Error fetching price:', error)
    res.status(500).json({ error: 'Error fetching price' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
