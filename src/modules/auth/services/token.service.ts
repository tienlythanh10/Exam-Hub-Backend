import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  generateHexToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateOTP() {
    const randomNumber = Math.floor(Math.random() * 1e6);
    const otp: string = String(randomNumber).padStart(6, '0');

    return otp;
  }

  hashToken(rawToken: string) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  encryptToken(payload: string) {
    let key = this.configService.get('ENCRYPTION_KEY');

    key = crypto
      .createHash('sha256')
      .update(String(key))
      .digest('base64')
      .substring(0, 32);

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let cipherBuffer = cipher.update(payload, 'binary');
    cipher.final();
    let authTag = cipher.getAuthTag();

    let encrypted = Buffer.concat([iv, cipherBuffer, authTag]).toString('hex');
    return encrypted;
  }

  decryptToken = (data: string) => {
    let key = this.configService.get('ENCRYPTION_KEY');

    key = crypto
      .createHash('sha256')
      .update(String(key))
      .digest('base64')
      .substring(0, 32);

    try {
      var bufferData = Buffer.from(data, 'hex');
      var ivPart = bufferData.slice(0, 12);
      /* Auth Tag Buffer length is 16 */
      var authTagPart = bufferData.slice(bufferData.length - 16);
      var cipherBufferPart = bufferData.slice(12, bufferData.length - 16);
    } catch (error) {
      throw new Error('Invalid Token');
    }

    const decipher = crypto
      .createDecipheriv('aes-256-gcm', key, ivPart)
      .setAuthTag(authTagPart);
    const result = decipher.update(cipherBufferPart).toString('utf-8');
    decipher.final();

    return result;
  };
}
