import RoomService from '#services/room_service'
import GameService from '#services/game_service'
import Room from '#models/room'
import RoomPlayer from '#models/room_player'

export default class RoomController {
async create({ user, request, response }: any) {
  const userId = user.id
  const body = request.all()
  console.log('BODY REQUEST:', body)
  const { name } = request.only(['name'])
  console.log('NAME:', name)
  const room = await RoomService.createRoom(userId, name)
  await RoomService.joinRoom(room.id, userId)
  return response.created(room)
}


  async join({ user, params, response }: any) {
    const userId = user.id
    await RoomService.joinRoom(params.id, userId)
    return response.ok({ joined: true })
  }

  async list({ response }: any) {
    const rooms = await RoomService.listRooms()
    return response.ok(rooms)
  }

async status({ params, response }: any) {
  const room = await Room.find(params.id)
  if (!room) {
    return response.notFound({ message: 'Sala eliminada' })
  }
  const status = await RoomService.getRoomStatus(params.id)
  return response.ok(status)
}


  async leave({ user, params, response }: any) {
  await RoomService.leaveRoom(params.id, user.id)
  return response.ok({ left: true })
}


// POST /rooms/:id/start
async start({ user, params, response }: any) {
  const roomId = params.id
  const userId = user.id

  const room = await Room.findOrFail(roomId)

  // Solo el anfitrión puede iniciar
  if (room.hostId !== userId) {
    return response.unauthorized({ message: 'Solo el anfitrión puede iniciar el juego' })
  }

  // Verifica que haya suficientes jugadores
  const players = await RoomPlayer.query().where('room_id', roomId)
  if (players.length < 2) {
    return response.badRequest({ message: 'Se requieren al menos 2 jugadores' })
  }

  // Cambia estado a 'playing'
  room.status = 'playing'
  await room.save()

  // Inicia el juego desde la sala
  await GameService.startGameFromRoom(room)

  return response.ok({ started: true })
}

}
