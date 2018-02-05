const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')


describe.only('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret', adult: true })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await helper.usersInDb()
    const newUser = {
      username: 'uusiKayttaja',
      name: 'Herra Kayttaja',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map( u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      adult: true,
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'username must be unique' })

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails with too short password', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'apina',
      name: 'Herra Huonosalaus',
      adult: true,
      password: 'sa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'password must be atleast three(3) characters long' })

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })


  test('the first user has username root', async () => {
    const response = await api
      .get('/api/users')
    var firstUser = response.body[0]
    expect(firstUser.username).toBe('root')
  })
})



afterAll(() => {
  server.close()
})