import RoomRepository from '#repositories/room_repository'
import RoomPlayer from '#models/room_player'
import Room from '#models/room'

export default class RoomService {
  static async createRoom(hostId: string, name: string) {  // ← ACEPTA name
    return await RoomRepository.create(hostId, name)       // ← Lo pasa al repo
  }

  static async joinRoom(roomId: string, userId: string) {
    const exists = await RoomRepository.findPlayer(roomId, userId)
    if (exists) throw new Error('Ya estás en la sala')
    return await RoomRepository.addPlayer(roomId, userId)
  }

  static async listRooms() {
    return await RoomRepository.listAvailable()
  }

// RoomService.ts
static async getRoomStatus(roomId: string) {
  const room = await Room.findOrFail(roomId)
  const playersDetailed = await RoomPlayer
    .query()
    .where('room_id', roomId)
    .preload('user')

  // Limpia jugadores sin usuario o sin sesión válida
  const validPlayers = playersDetailed.filter(p => !!p.user)

  // Opcional: Elimina de la base de datos los "fantasmas" aquí
  const idsToDelete = playersDetailed.filter(p => !p.user).map(p => p.userId)
  if (idsToDelete.length) {
    await RoomPlayer.query()
      .where('room_id', roomId)
      .whereIn('user_id', idsToDelete)
      .delete()
  }

  return {
    hostId: room.hostId,
    status: room.status,
    players: validPlayers.map((p) => ({
      id: p.userId,
      name: p.user?.name || 'Desconocido'
    }))
  }
}



  static async canStart(roomId: string) {
    const total = await RoomRepository.countPlayers(roomId)
    return total >= 4 && total <= 16
  }

static async leaveRoom(roomId: string, userId: string) {
  // Encuentra la sala
  const room = await Room.findOrFail(roomId)
  // Si el que sale es el anfitrión...
  if (room.hostId === userId) {
    // Elimina todos los jugadores de la sala
    await RoomPlayer.query().where('room_id', roomId).delete()
    // Elimina la sala
    await room.delete()
  } else {
    // Solo elimina al jugador de RoomPlayer
    await RoomPlayer.query().where('room_id', roomId).where('user_id', userId).delete()
  }
}


}
