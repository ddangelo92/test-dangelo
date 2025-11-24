import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltLength = 64;
  private readonly tagLength = 16;

  /**
   * Encrypts a password using AES-256-GCM
   * Returns the encrypted data with salt, IV, and auth tag
   */
  encrypt(plaintext: string): string {
    // Generate random salt and IV
    const salt = randomBytes(this.saltLength);
    const iv = randomBytes(this.ivLength);

    // Derive key from a random password using scrypt
    const password = randomBytes(32).toString('hex');
    const key = scryptSync(password, salt, this.keyLength);

    // Create cipher and encrypt
    const cipher = createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    // Get authentication tag
    const tag = cipher.getAuthTag();

    // Combine all components: salt + iv + tag + encrypted data + password
    const result = Buffer.concat([
      salt,
      iv,
      tag,
      encrypted,
      Buffer.from(password, 'utf8'),
    ]);

    return result.toString('base64');
  }

  /**
   * Decrypts the encrypted password
   */
  decrypt(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');

    // Extract components
    const salt = buffer.subarray(0, this.saltLength);
    const iv = buffer.subarray(this.saltLength, this.saltLength + this.ivLength);
    const tag = buffer.subarray(
      this.saltLength + this.ivLength,
      this.saltLength + this.ivLength + this.tagLength
    );
    const password = buffer.subarray(buffer.length - 64).toString('utf8');
    const encrypted = buffer.subarray(
      this.saltLength + this.ivLength + this.tagLength,
      buffer.length - 64
    );

    // Derive key
    const key = scryptSync(password, salt, this.keyLength);

    // Create decipher and decrypt
    const decipher = createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
