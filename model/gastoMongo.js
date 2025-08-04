const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017/'
let cliente

async function conectar() {
    if (!cliente) cliente = await MongoClient.connect(url)
    return cliente.db('gastos')
}

class GastoMongo {
    async cria(transacao) {
        const db = await conectar()
        const colecao = db.collection('transacoes')

        if (!transacao.id) {
            const maior = await colecao.find().sort({ id: -1 }).limit(1).toArray()
            transacao.id = (maior[0]?.id || 0) + 1
        }

        await colecao.insertOne(transacao)
    }

    async lista() {
        const db = await conectar()
        return await db.collection('transacoes').find().sort({ data: -1 }).toArray()
    }

    async excluir(id) {
        const db = await conectar()
        await db.collection('transacoes').deleteOne({ id: id })
    }

    async saldo() {
        const db = await conectar()
        const transacoes = await db.collection('transacoes').find().toArray()

        return transacoes.reduce((total, t) => {
            return total + (t.tipo === 'receita' ? t.valor : -t.valor)
        }, 0)
    }

    async gastosPorCategoria() {
        const db = await conectar()
        const pipeline = [
            { $match: { tipo: 'despesa' } },
            {
                $group: {
                    _id: "$categoria",
                    total: { $sum: "$valor" }
                }
            }
        ]
        return await db.collection('transacoes').aggregate(pipeline).toArray()
    }
}

module.exports = new GastoMongo()