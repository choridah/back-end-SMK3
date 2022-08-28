// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export default class RegisterController {
  public async index ({request, response}) {
    const {
      username,
      email,
      password,
      name,
      address,
      phone,
      company,
    } = request.body()
    try {
      const user = await User.create({
        username, email, password,
      })

      const profile = await Profile.create({
        user_id: user.id,
        name,
        address,
        phone,
        company,
      })

      return response.status(201).json({
        error: false,
        status: 'success',
        data: {
          user,
          profile,
        },
      })
    } catch (error) {
      return response.json({
        error: true,
        status: 'error',
        data: error,
      })
    }
  }
}
