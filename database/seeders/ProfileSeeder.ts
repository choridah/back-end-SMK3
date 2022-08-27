import { faker } from '@faker-js/faker'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Profile.createMany(
      (await User.all()).map(user => {
        return {
          user_id: user.id,
          name: faker.name.fullName(),
          address: faker.address.streetAddress(true),
          phone: faker.phone.number('62###########'),
          company: faker.company.name(),
        }
      })
    )
  }
}
