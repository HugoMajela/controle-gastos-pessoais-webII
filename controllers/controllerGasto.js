const gastos = require('../model/gastoMongo')
const autenticacao = require('../autenticacao');

exports.tela_principal = async (req, res) => {
    const usuario = autenticacao.getUsuario();
    if (!usuario) {
        return res.redirect('/usuario/login');
    }

    req.usuario = usuario;

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
    res.render('criarTransacao', { titulo_pagina: "Nova Transação" })
}

exports.cria_post = async (req, res) => {
    const transacao = {
        descricao: req.body.descricao,
        categoria: req.body.categoria,
        valor: parseFloat(req.body.valor),
        observacao: req.body.observacao || "",
        tipo: "despesa" // fixo
    };

    await gastos.cria(transacao);
    res.redirect('/');
};


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