import Room from '#models/room'
import RoomPlayer from '#models/room_player'

export default class RoomRepository {
 static async create(hostId: string, name: string) {
  return await Room.create({
    hostId,
    name,           // 👈 ¡Ahora sí va el nombre!
    status: 'waiting'
  })
}


  static async findById(id: string) {
    return await Room.find(id)
  }

  static async addPlayer(roomId: string, userId: string) {
    return await RoomPlayer.create({ roomId, userId })
  }

  static async getPlayers(roomId: string) {
    return await RoomPlayer.query().where('roomId', roomId)
  }

static async listAvailable() {
  // 1. Obtén todas las salas en estado 'waiting'
  const rooms = await Room.query().where('status', 'waiting')

  // 2. Para cada sala, cuenta los jugadores y regresa la sala con la propiedad players
  const result = await Promise.all(
    rooms.map(async (room) => {
      // ¡CUIDADO! Usa el nombre correcto del campo: 'roomId' o 'room_id'
      const playersCount = await RoomPlayer.query().where('roomId', room.id).count('* as total')
      return {
        ...room.serialize(),
        players: Number(playersCount[0].$extras.total)
      }
    })
  )

  // 3. Solo devuelve salas con 1 o más jugadores
  return result.filter(r => r.players > 0)
}


  static async findPlayer(roomId: string, userId: string) {
    return await RoomPlayer.query()
      .where('roomId', roomId)
      .where('userId', userId)
      .first()
  }

  static async countPlayers(roomId: string): Promise<number> {
  const countResult = await RoomPlayer.query().where('room_id', roomId).count('* as total')
  return Number(countResult[0].$extras.total)
}


  static async updateStatus(roomId: string, status: 'waiting' | 'playing' | 'finished') {
    const room = await Room.findOrFail(roomId)
    room.status = status
    await room.save()
    return room
  }
}
