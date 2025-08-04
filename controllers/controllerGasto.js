const gastos = require('../model/gastoMongo')

exports.tela_principal = async (req, res) => {
    const lista = await gastos.lista()
    const saldo = await gastos.saldo()

    const contexto = {
        titulo_pagina: "Controle de Gastos",
        transacoes: lista,
        saldo: saldo
    }

    res.render('index', contexto)
}

exports.cria_get = (req, res) => {
    res.render('criarTransacao', {titulo_pagina: "Nova Transação"})
}

exports.cria_post = async (req, res) => {
    const transacao = req.body
    transacao.valor = parseFloat(transacao.valor)
    transacao.data = new Date(transacao.data)

    await gastos.cria(transacao)
    res.redirect('/')
}

exports.excluir = async (req, res) => {
    const id = parseInt(req.params.id)
    await gastos.excluir(id)
    res.redirect('/')
}

exports.exportaCSV = async (req, res) => {
    const json2csv = require('json2csv').parse
    const dados = await gastos.lista()

    const csv = json2csv(dados, {
        fields: ['id', 'descricao', 'tipo', 'categoria', 'valor', 'data'],
        delimiter: ';'
    })

    res.header('Content-Type', 'text/csv')
    res.attachment('gastos.csv')
    res.send(csv)
}

exports.dadosGrafico = async (req, res) => {
    const dados = await gastos.gastosPorCategoria()
    res.json(dados)
}