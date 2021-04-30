const {Router} = require('express');
const routes = new Router();

const authMiddleware = require('./app/middlewares/auth');

//Multer -> Trabalhando com arquivos do tipo File.
const multer = require('multer');
const multerConfig = require('./config/multer');
const upload = multer(multerConfig);

const CadastroController = require('./app/controllers/CadastroController');
const SessionController = require('./app/controllers/SessionController');

const ProviderController = require('./app/controllers/ProviderController');
const ProviderSessionController = require('./app/controllers/ProviderSessionController');
const FileController = require('./app/controllers/FileController');
const AgendamentoController = require('./app/controllers/AgendamentoController');
const NotificationController = require('./app/controllers/NotificationController');

routes.post('/cadastro',CadastroController.store);
routes.post('/login',SessionController.store);

routes.post('/providerlogin',ProviderSessionController.store);
routes.post('/providercadastro',ProviderController.store);


//Rotas que precisam do token->
routes.use(authMiddleware);
routes.put('/atualizarCadastro', CadastroController.update);
routes.put('/atualizarprovider', ProviderController.update);

routes.post('/files',upload.single('file'),FileController.store);

routes.post('/realizaragendamento',AgendamentoController.store);
routes.get('/agendamentos',AgendamentoController.index);
routes.delete('/deletaragendamentos/:id',AgendamentoController.delete);

routes.get('/notifications', NotificationController.index);



module.exports = routes;