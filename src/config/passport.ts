import { NextFunction, Response, Request } from 'express';
import passport from 'passport';
import {BasicStrategy} from 'passport-http'
import { User } from '../models/User';

import dotenv from 'dotenv';

import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import jwt from 'jsonwebtoken';

dotenv.config();

const notAuthorizedJsonBasic = { status: 401, message: 'Not Authorized Basic'}
const notAuthorizedJsonJWT = { status: 401, message: 'Not Authorized JWT'}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
}

//With JWT Authetication
passport.use(new JWTStrategy( options, async (payload, done) => {

  const user = await User.findByPk(payload.id)

  return user ? done(null, user) : done(notAuthorizedJsonJWT, false);

}));

// BASIC Strategy
// passport.use(new BasicStrategy( async(email, password, done)=>{

//   if (email && password){
//     const user = await User.findOne({ where: {email, password}})

//     if (user) {
//       return done(null, user);   
//     }    
//   }
//   return done(notAuthorizedJsonBasic, false);
// }));


export const privateRouteBasic = async (req: Request, res: Response, next: NextFunction) => {
  // const authFunction = passport.authenticate('basic', (err, user) => {
  //   if(user) {
  //     next();
  //   } else {
  //     next(notAuthorizedJson);
  //   }
  // })
  // authFunction(req, res, next);
  passport.authenticate('basic', (err, user) => {
    req.user = user;
    return user ? next() : next(notAuthorizedJsonBasic);
  })(req, res, next);
}

export const generateToken = (data: object): string => {
  return jwt.sign(data, process.env.JWT_SECRET as string)
}

export const privateRouteJWT = async (req: Request, res: Response, next: NextFunction) => {
  // const authFunction = passport.authenticate('jwt', (err, user) => {
  //   if(user) {
  //     next();
  //   } else {
  //     next(notAuthorizedJsonJWT);
  //   }
  // })
  // authFunction(req, res, next);

  passport.authenticate('jwt', (err, user) => {
    req.user = user;
    return user ? next() : next(notAuthorizedJsonJWT);
  })(req, res, next);
}
export default passport;