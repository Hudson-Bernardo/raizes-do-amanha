import { iniciarContraste } from './modules/contraste.js';
import { iniciarMenu } from './modules/menu.js';
import { iniciarFeedback } from './modules/feedback.js';
import { iniciarRoteador } from './modules/roteador.js';
// O ponto de entrada inicializa componentes persistentes apenas uma vez.
iniciarContraste();
iniciarFeedback();
const fecharMenu = iniciarMenu();
iniciarRoteador(fecharMenu);
