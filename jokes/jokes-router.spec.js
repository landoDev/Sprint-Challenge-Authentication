const request = require('supertest')
const server = require('../api/server');
const db = require('../database/dbConfig');

let testUser = {
    username: 'Darth Vader',
    password:'iamyourfather'
};

describe('jokes-router', () => {
    afterEach(async () =>{
        await db('users').truncate()
    })
    // let token;
    // beforeAll(async (done) => {
    //     request(server)
    //       .post('/api/auth/login')
    //       .send({
    //         username: 'Darth Vader',
    //         password: 'iamyourfather',
    //       })
        //   .end((err, response) => {
        //     token = response.body.token; // save the token!
    //         done();
    //       });
    // });
    describe('GET /', () => {
        it('should return a message if not logged in', () => {
            return request(server).get('/api/jokes')
            .then(res => {
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Please login first')
            })
        });
        it('should return 200 OK', async () => {
            return request(server)
            .post('/api/auth/register')
            .send(testUser).then(res => {
                return request(server)
                .post('/api/auth/login')
                .send(testUser)
                .then(res =>{
                    const token = res.body.token;
                    return request(server)
                    .get('/api/jokes')
                    .set('Authorization', token)
                    .then(res => {
                        expect(res.status).toBe(200)
                    });
                 }); 
            });
        });
        // it('should return dad jokes', () => {
        //     return request(server).get('/api/jokes') 
        //     .then(res => {
        //         expect(res.status).toBe(200) // change this if time
        //     })
        // })
    });
    
});
