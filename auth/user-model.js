const db = require('../database/dbConfig');

module.exports = {
    add,
    find,
    findBy,
    findById,
    update, // more relevant perhaps on a full user app
    remove
};

async function add (user) {
    const [id] = await db('users').insert(user, 'id');

    return findById(id); // if this breaks on the front end, just return the user?
}

function find(){
    return db('users').select('id', 'username');
}

function findBy(param){
    return db('users').where(param);
};

function findById(id) {
    return db('users').where({ id }).first();
}

function update(id, update) {
    return db('users').where({ id }).update(update)
}

function remove(id) {
    return db('users')
    .where({ id })
    .del()
}