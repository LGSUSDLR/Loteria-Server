import router from '@adonisjs/core/services/router'
import CardsController from '#controllers/cards_controller'
const AuthController = () => import('#controllers/auth_controller')
const RoomController = () => import('#controllers/room_controller')
const GameController = () => import('#controllers/game_controller')
const ProfileController = () => import('#controllers/profile_controller')
import { middleware } from './kernel.js'
import StaticController from '#controllers/static_controller'

router.get('/cartas/*', [StaticController, 'serve'])

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.get('/cartas/nombre/:name', [CardsController, 'getByName'])
router.get('/cartas', [CardsController, 'index'])

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
  })
  .use(middleware.auth())

router.group(() => {
  router.post('/rooms', [RoomController, 'create'])
  router.post('/rooms/:id/join', [RoomController, 'join'])
  router.get('/rooms', [RoomController, 'list'])
  router.get('/rooms/:id/status', [RoomController, 'status'])
  router.post('/rooms/:id/leave', [RoomController, 'leave'])
  router.post('/rooms/:id/start', [RoomController, 'start'])
}).use(middleware.auth())

router.group(() => {
  router.post('/games/start/:roomId', [GameController, 'startFromRoom'])
  router.post('/games/:gameId/flip', [GameController, 'flipCard'])
  router.post('/games/:gamePlayerId/mark', [GameController, 'markCard'])
  router.post('/games/:gamePlayerId/validate-winner', [GameController, 'validateWinner'])
  router.get('/games/:gameId/state', [GameController, 'state'])
  router.get('/rooms/:roomId/game', [GameController, 'getGameForRoom'])
  router.post('/games/:gameId/end', [GameController, 'endGame'])
  router.post('/games/:gameId/leave', [GameController, 'leaveGame'])
}).use(middleware.auth())

router
  .group(() => {
    router.get('/profile', [ProfileController, 'show'])
    router.put('/profile', [ProfileController, 'update'])
    router.delete('/profile', [ProfileController, 'destroy'])
  })
  .use(middleware.auth())