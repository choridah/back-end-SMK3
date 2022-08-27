// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LoginController {
  public async index ({request, response, auth}) {
    const {email, username, password} = request.body()
    try {
      await auth.use('api').check()
      if (auth.use('api').isLoggedIn) {
        return response.status(401).json({
          error: true,
          status: 'warning',
          message: 'You have logged in',
        })
      }

      const user = await User
        .query()
        .where('email', email || '')
        .orWhere('username', username || '')
        .firstOrFail()

      if (!(await Hash.verify(user.password, '' + password))) {
        return response.status(401).json({
          error: true,
          status: 'error',
          message: 'Invalid credentials or something',
        })
      }

      const token = await auth.use('api').generate(user)

      return response.status(200).json({
        error: false,
        status: 'success',
        message: 'Login has successfully',
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      Logger.info(error)
      return response.status(401).json({
        error: true,
        status: 'error',
        data: error,
        message: 'Invalid credentials or something',
      })
    }
  }
}
