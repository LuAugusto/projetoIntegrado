const {Router} = require('express');
const routes = new Router();
const CadastroController = require('./controllers/CadastroController');
const SessionController = require('./controllers/SessionController');
const EmpresaController = require('./controllers/EmpresaController');
const EsessionController = require('./controllers/EsessionController');
const PedidoController = require('./controllers/PedidoController');

const authMiddleware = require('./middlewares/auth');

routes.post('/cadastro',CadastroController.store);
routes.post('/login',SessionController.store);
routes.post('/paraempresas',EmpresaController.store);
routes.post('/empresas',EsessionController.store);

//Rotas que precisam do token->
routes.use(authMiddleware);
routes.post('/pedido',PedidoController.store);
routes.get('/pedidos',PedidoController.index);



module.exports = routes;