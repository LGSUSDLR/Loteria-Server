// app/services/game_service.ts
import Game from '#models/game'
import Room from '#models/room'
import RoomPlayer from '#models/room_player'
import GamePlayer from '#models/game_player'
import GameCard from '#models/game_card'
import GameMark from '#models/game_mark'
import { ALL_CARDS } from '#utils/lottery_cards'
import User from '#models/user'

export default class GameService {
  // 1. Iniciar partida desde una room
  static async startGameFromRoom(room: Room) {
  const game = await Game.create({
    roomId: room.id,
    hostId: room.hostId,
    status: 'playing',
  });

  const players = await RoomPlayer.query().where('room_id', room.id);
  const usedCartons = new Set<string>();
  const CARTA_SIZE = 16;

  for (const player of players) {
    // SOLO CREA CARTÓN SI NO ES EL HOST
    if (player.userId === room.hostId) continue;

    let cartasJugador: string[];
    let cartaKey: string;
    do {
      cartasJugador = this.shuffleArray([...ALL_CARDS]).slice(0, CARTA_SIZE);
      cartaKey = cartasJugador.join(',');
    } while (usedCartons.has(cartaKey));
    usedCartons.add(cartaKey);

    await GamePlayer.create({
      gameId: game.id,
      userId: player.userId,
      card: JSON.stringify(cartasJugador),
      isWinner: false,
    });
  }

  return game;
}


  // Fisher-Yates shuffle
  private static shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // 2. El anfitrión voltea/barajea la siguiente carta (sin repetir)
  static async flipNextCard(gameId: string, hostId: string) {
    const game = await Game.findOrFail(gameId)
    if (game.hostId !== hostId) throw new Error('Solo el anfitrión puede barajar cartas')
    if (game.status !== 'playing') throw new Error('La partida no está activa')

    const usedCards = await GameCard.query().where('game_id', gameId)
    const used = usedCards.map(c => c.card)
    const available = ALL_CARDS.filter(c => !used.includes(c))
    if (available.length === 0) throw new Error('Ya no quedan cartas por voltear')

    const next = available[Math.floor(Math.random() * available.length)]
    await GameCard.create({ gameId, card: next })
    return next
  }

// 3. El jugador marca una carta (SOLO impide marcar dos veces, no banea aquí)
// app/services/game_service.ts
// app/services/game_service.ts

static async markCard(gamePlayerId: string, card: string) {
  const player = await GamePlayer.findOrFail(gamePlayerId)

  // Ya está baneado, no puede marcar nada
  if (player.isBanned) throw new Error('Has sido baneado por trampa.')

  // Solo prohíbe marcar la misma carta dos veces
  const existing = await GameMark.query()
    .where('game_player_id', gamePlayerId)
    .where('card', card)
    .first()
  if (existing) throw new Error('Ya marcaste esa carta')

  // ¡Permite marcar cualquier carta!
  await GameMark.create({ gamePlayerId, card })
  return { success: true }
}


static async validateWinner(gamePlayerId: string) {
  const player = await GamePlayer.findOrFail(gamePlayerId)
  if (player.isBanned) throw new Error('Has sido baneado por trampa.')

  const cards = typeof player.card === 'string' ? JSON.parse(player.card) : player.card
  const marks = await GameMark.query().where('game_player_id', gamePlayerId)
  const flipped = await GameCard.query().where('game_id', player.gameId)
  const flippedSet = new Set(flipped.map(gc => gc.card))

  // Debe tener todas las fichas puestas (sin faltar ni sobrar)
  if (marks.length !== cards.length) return { winner: false }

  // Todas las cartas marcadas deben estar en cardsFlipped
  const allMarksFlipped = marks.every(m => flippedSet.has(m.card))
  if (!allMarksFlipped) {
    player.isBanned = true
    await player.save()
    throw new Error('Trampa detectada: pusiste fichas en cartas que no han salido. Has sido baneado.')
  }

  // Todas las cartas de su cartón deben estar marcadas
  const markedSet = new Set(marks.map(m => m.card))
const allCardsMarked = cards.every((c: string) => markedSet.has(c))
  if (!allCardsMarked) return { winner: false }

  // Si todo se cumple, ¡es ganador!
  player.isWinner = true
  await player.save()
  return { winner: true }
}


  // 5. Consultar el estado general del juego (para polling frontend)
 static async getGameState(gameId: string) {
  const game = await Game.findOrFail(gameId)
  const gamePlayers = await GamePlayer.query().where('game_id', gameId)
const cardsFlipped = await GameCard.query().where('game_id', gameId).orderBy('created_at', 'asc')

  const userIds = gamePlayers.map(gp => gp.userId)
  const users = await User.query().whereIn('id', userIds)

  return {
    status: game.status,
    cardsFlipped: cardsFlipped.map(c => c.card),
    players: await Promise.all(gamePlayers.map(async gp => {
      const marks = await GameMark.query().where('game_player_id', gp.id)
      const user = users.find(u => u.id === gp.userId)
      return {
        playerId: gp.userId,
        gamePlayerId: gp.id,        // <-- Agrega esto!!
        name: user?.name || 'Jugador',
        card: typeof gp.card === 'string' ? JSON.parse(gp.card) : gp.card,
        marks: marks.map(m => m.card),
        isWinner: gp.isWinner,
        isBanned: gp.isBanned,  // <-- nuevo campo importante
      }
    })),
    hostId: game.hostId,
  }
}

}
