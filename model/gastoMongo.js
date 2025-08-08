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

class GastoMongo {
    async cria(transacao) {
        const db = await conectar();
        const gastos = db.collection('gastos');

        // ID numérico sequencial
        const maior = await gastos.find().sort({ id: -1 }).limit(1).toArray();
        transacao.id = (maior[0]?.id || 0) + 1;

        await gastos.insertOne(transacao);
    }

    async lista() {
        const db = await conectar();
        return await db.collection('gastos').find().sort({ id: -1 }).toArray();
    }

    async excluir(id) {
        const db = await conectar();
        await db.collection('gastos').deleteOne({ id: id });
    }

    async saldo() {
        const db = await conectar();
        const transacoes = await db.collection('gastos').find().toArray();
        return transacoes.reduce((total, t) => total - t.valor, 0);
    }

    async gastosPorCategoria() {
        const db = await conectar();
        const pipeline = [
            {
                $group: {
                    _id: "$categoria",
                    total: { $sum: "$valor" }
                }
            }
        ];
        return await db.collection('gastos').aggregate(pipeline).toArray();
    }
}

module.exports = new GastoMongo();