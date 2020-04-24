const request = require('supertest')
const server = require('../api/server');
const db = require('../database/dbConfig')

// maybe bring newUser object up here to be more DRY

describe('auth-router', () => {
    describe('POST /register', () => {
        beforeEach(async () =>{
            await db('users').truncate()
        })
        it('should return 201 on success', async () => {
            const body = {username: 'Darth Vader', password:"iamyourfather" };
            const response = await request(server).post("/api/auth/register").send(body);
            expect(response.status).toEqual(201);
        });

        it('should add a user to the db', async function() {
            const newUser= {
                username: 'Darth Vader',
                password:'iamyourfather'
            };
            const existing = await db('users').where({username: newUser.username});
            expect(existing).toHaveLength(0)
            await request(server).post("/api/auth/register")
            .send(newUser)
            const inserted = await db('users').where({username: newUser.username});
            expect(inserted).toHaveLength(1)
        });
        it.todo('should recieve an object with a username and password property', () =>{
            // use .toThrow when passing object with just username
        })
    });

    describe("POST /login", () => {
        it('should return 200 on success', () => {
            return request(server).post('/login')
            .send({name: 'Darth Vader'})
            .then(res => {
                expect(res.status).toBe(201);
            })
        });

        it('should return a welcome message to the user', async function() {
            return request(server).post('/login')
            .send({name: 'Darth Vader'})
            .then(res => {
                expect(res.body.message).toBe("Not the proper message");
            })
        });
        it.todo('should produce a token')
    });

});