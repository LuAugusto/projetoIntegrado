const {Router} = require('express');
const routes = new Router();
const CadastroController = require('./controllers/CadastroController');
const SessionController = require('./controllers/SessionController');
const authMiddleware = require('./middlewares/auth');

routes.post('/cadastro',CadastroController.store);
routes.post('/login',SessionController.store);

//Rotas que precisam do token->
routes.use(authMiddleware);
routes.put('/up',SessionController.update);


module.exports = routes;