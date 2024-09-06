const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
    async generateToken(id, name, role){
        const payload = {
            id, 
            name,
            role
        }
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h'});
    }

    async validateAcessToken(accessToken) {
		try {
			const userData = jwt.verify(accessToken, process.env.SECRET_KEY);
			return userData;
		}
		catch(e) {
			console.log('Error by validateAcessToken', e)
			return null;
		}
	}
}

module.exports = new TokenService();