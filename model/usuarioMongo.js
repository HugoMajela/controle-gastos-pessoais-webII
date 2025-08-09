const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';
let cliente;
let db;

async function conectar() {
    if (!db) {
        if (!cliente) cliente = await MongoClient.connect(url);
        db = cliente.db('controle_gastos');
    }
    return db;
}

class UsuarioMongo {
    async criar(usuario) {
        const db = await conectar();
        await db.collection('usuarios').insertOne(usuario);
    }

    async buscarPorEmail(email) {
        const db = await conectar();
        return await db.collection('usuarios').findOne({ email });
    }
}

module.exports = new UsuarioMongo();