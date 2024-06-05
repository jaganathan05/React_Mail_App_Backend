const Express = require('express')
const Router = Express.Router()
const User_controller = require('../Controller/User_controller')
const authentication = require('../Middleware/Auth')


Router.post('/signup', User_controller.PostSignup);

Router.post('/login', User_controller.PostLogin)

Router.post('/sendmail',authentication.authentication,User_controller.PostMail)

Router.get('/receivedmails',authentication.authentication,User_controller.FetchReceivedMails)

Router.post('/Mailupdate/:id',authentication.authentication,User_controller.updateread)

Router.get('/sendedmails',authentication.authentication,User_controller.FetchSendedMails)

Router.post('/deleterecivemail/:id',authentication.authentication,User_controller.DeleteReciverMail)

Router.post('/deletesendermail/:id',authentication.authentication,User_controller.DeleteSenderMail)
module.exports = Router;