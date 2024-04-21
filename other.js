const crypto = require('crypto')

class Other {
    generateSecureToken() {
        return crypto.randomBytes(32).toString('hex')
    }

    generateRefcode () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let confirmationCode = '';

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            confirmationCode += characters.charAt(randomIndex); 
        }

        return confirmationCode;
    }
}

module.exports = Other