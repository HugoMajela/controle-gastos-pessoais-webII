const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')

const rotasGastos = require('./routes/rotasGastos')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', rotasGastos)

app.use((req, res) => {
    res.status(404).render('error', { message: "Página não encontrada" })
})

module.exports = app