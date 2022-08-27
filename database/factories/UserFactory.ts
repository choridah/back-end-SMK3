import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(undefined, undefined, 'gmail'),
    password: '12345678',
  }
}).build()
