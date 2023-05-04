const express = require(`express`)
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const cors = require(`cors`)
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const userRoute = require('./routes/user')
app.use('/user', userRoute)

const mejaRoute = require('./routes/meja')
app.use('/meja', mejaRoute)

const menuRoute = require('./routes/menu')
app.use('/menu', menuRoute)

const transaksiRoute = require('./routes/transaksi')
app.use('/transaksi', transaksiRoute)

app.listen(PORT, () => {
    console.log(`Server of Wikusama Cafe runs on port
    ${PORT}`)   
})