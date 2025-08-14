import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import RoomPlayer from '#models/room_player'
import User from '#models/user' // 👈 importa tu modelo User

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    const user = ctx?.auth?.user as User | undefined

    if (error.status === 401 && user?.id) {
      await RoomPlayer.query().where('user_id', user.id).delete()
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
