const crypto = require('crypto');

const key = 'mi_clave_secreta_de_32_caracteres0';
const algorithm = 'aes-256-cbc';

// Tomar un ejemplo real del archivo JSON
const encryptedExample = "e5f58d35e3c60b15ab91f06e279160b8:27126b0d2f2f3707065630c9e0f0f959";

function decrypt(encryptedText) {
    try {
        const textParts = encryptedText.split(':');
        
        if (textParts.length !== 2) {
            console.log('Formato incorrecto, partes:', textParts.length);
            return encryptedText;
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedData = textParts[1];
        
        console.log('IV:', iv.toString('hex'));
        console.log('IV length:', iv.length);
        console.log('Key length:', Buffer.from(key).length);
        console.log('Encrypted data:', encryptedData);
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Error en desencriptación:', error.message);
        return encryptedText;
    }
}

console.log('Probando desencriptación...');
console.log('Texto encriptado:', encryptedExample);
console.log('Resultado:', decrypt(encryptedExample));
