const request = require('supertest')
const server = require('../api/server');
const db = require('../database/dbConfig')

// maybe bring newUser object up here to be more DRY
let newUser= {
    username: 'Darth Vader',
    password:'iamyourfather'
};

describe('auth-router', () => {
    describe('POST /register', () => {
        beforeEach(async () =>{
            await db('users').truncate()
        })
        it('should return 201 on success', async () => {
            const body = newUser;
            const response = await request(server).post("/api/auth/register").send(body);
            expect(response.status).toEqual(201);
        });

        it('should add a user to the db', async function() {
            // const newUser= {
            //     username: 'Darth Vader',
            //     password:'iamyourfather'
            // };
            const existing = await db('users').where({username: newUser.username});
            expect(existing).toHaveLength(0)
            await request(server).post("/api/auth/register")
            .send(newUser)
            const inserted = await db('users').where({username: newUser.username});
            expect(inserted).toHaveLength(1)
        });
        it.todo('should reject an object without username or password properties'
            // use .toThrow when passing object with just username and just password
        )
    });

    describe("POST /login", () => {
        it('should return 200 on success', () => {
            return request(server).post('/api/auth/login')
            .send(newUser)
            .then(res => {
                expect(res.status).toBe(200);
            })
        });

        it('should return a welcome message to the user', async function() {
            return request(server).post('/api/auth/login')
            .send(newUser)
            .then(res => {
                expect(res.body.message).toBe(`Welcome ${newUser.username}`);
            })
        });
        it.todo('should return an unauthorized message when given the wrong password')
        it.todo('should produce a token')
    });

});