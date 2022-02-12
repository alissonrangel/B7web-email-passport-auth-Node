import { Router } from 'express';

import * as ApiController from '../controllers/apiController';

import * as EmailController from '../controllers/emailController';

import {privateRouteBasic, privateRouteJWT} from '../config/passport'

const router = Router();

router.get('/ping', ApiController.ping);

router.post('/contato', EmailController.contato);

router.get('/listbasic', privateRouteBasic, ApiController.list);
//router.post('/login', ApiController.login);

router.get('/listjwt', privateRouteJWT, ApiController.list);
router.post('/register', ApiController.registerWithJWT);
router.post('/login', ApiController.loginWithJWT);

export default router;