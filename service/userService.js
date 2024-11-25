const bcrypt = require('bcryptjs') //для хеширования пароля
const jwt = require('jsonwebtoken'); //для создания jwt токен
const { User, Basket } = require('../models/models.js');
const tokenService = require('./tokenService.js'); 
require('dotenv').config();

class UserService {
	async registration(data) {
		const {userName} = data;
		const users = ['vic_wrest', 'Alena_ts_1997']
		const candidate = await User.findOne({where: {name: userName}});
		if(candidate) {
			return;
		}
		for(let i of users){
			const addedUser = await User.create({name: users[i], role: 'ADMIN'});
			return addedUser
		}
        //const token =  tokenService.generateToken(addedUser.id, addedUser.name, addedUser.role)
		//return token;
		return;
	}
	async login(data) {
		try{
		const {userName} = data;
        const user = await User.findOne({where: {name: userName}})
		if(!user) {
            return await this.registration(data);
		};
		
		const token = await tokenService.generateToken(user.id, user.name, user.role);
		return {token};
		}
		catch(e) {
			console.log(e);
            return
		}
	}
	async getUserByUsername(userName){
		const user = User.findOne({where: {name: userName}})
		return user;
	}
}
module.exports = new UserService()