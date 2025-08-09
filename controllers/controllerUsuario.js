const usuarios = require('../model/usuarioMongo');
const autenticacao = require('../autenticacao');

exports.cadastro_get = (req, res) => {
    res.render('cadastro', { titulo_pagina: "Cadastro" });
};

exports.cadastro_post = async (req, res) => {
    const { nome, email, senha, confirmar_senha, renda } = req.body;

    if (senha !== confirmar_senha) {
        return res.render('cadastro', { erro: "As senhas não coincidem" });
    }

    const existente = await usuarios.buscarPorEmail(email);
    if (existente) {
        return res.render('cadastro', { erro: "E-mail já cadastrado" });
    }

    await usuarios.criar({ nome, email, senha, renda: parseFloat(renda) });
    res.redirect('/usuario/login');
};

exports.login_get = (req, res) => {
    res.render('login', { titulo_pagina: "Login" });
};

exports.login_post = async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await usuarios.buscarPorEmail(email);
    if (!usuario || usuario.senha !== senha) {
        return res.render('login', { erro: "Usuário ou senha inválidos" });
    }

    // Guarda o usuário na variável global
    autenticacao.setUsuario({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
    });

    res.redirect('/');
};

exports.logout = (req, res) => {
    autenticacao.logout();
    res.redirect('/usuario/login');
};