import { Request, Response } from 'express';
import { User } from '../models/User';
import {generateToken} from '../config/passport'

export const ping = (req: Request, res: Response) => {
    res.json({pong: true});
}

export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;

        let hasUser = await User.findOne({where: { email }});
        if(!hasUser) {
            let newUser = await User.create({ email, password });

            res.status(201);
            res.json({ id: newUser.id });
        } else {
            res.json({ error: 'Email already exists.' });
        }
    }

    res.json({ error: 'Email and/or password not sent.' });
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({ 
            where: { email, password }
        });
                
        if(user) {
            res.json({ status: true, user: req.user });
            return;
        }
    }

    res.json({ status: false });
}

export const registerWithJWT = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;

        let hasUser = await User.findOne({where: { email }});
        if(!hasUser) {
            let newUser = await User.create({ email, password });

            let token = generateToken({id: newUser.id})

            res.status(201);
            res.json({ id: newUser.id, token });
        } else {
            res.json({ error: 'Email already exists.' });
        }
    }

    res.json({ error: 'Email and/or password not sent.' });
}

export const loginWithJWT = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({ 
            where: { email, password }
        });

        //with jwt auth
        if(user) {
            res.json({ status: true, user: req.user, token: generateToken({id: user.id}) });
            return;
        }
    }

    res.json({ status: false });
}

export const list = async (req: Request, res: Response) => {
    
    console.log("USER: ", req.user);
    
    
    let users = await User.findAll();
    let list: string[] = [];

    for(let i in users) {
        list.push( users[i].email );
    }

    res.json({ list });
}