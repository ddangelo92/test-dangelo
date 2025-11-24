import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { nanoid } from 'nanoid';

interface PasswordEntry {
  encryptedPassword: string;
  createdAt: Date;
}

@Injectable()
export class PasswordService {
  // In-memory storage using TypeScript Map
  private readonly storage = new Map<string, PasswordEntry>();

  constructor(private readonly cryptoService: CryptoService) {}

  /**
   * Stores an encrypted password and returns a unique ID
   * NEVER stores plaintext password
   */
  storePassword(plainPassword: string): string {
    // Encrypt the password immediately
    const encryptedPassword = this.cryptoService.encrypt(plainPassword);

    // Generate a unique ID for the link
    const id = nanoid(10);

    // Store only the encrypted version
    this.storage.set(id, {
      encryptedPassword,
      createdAt: new Date(),
    });

    return id;
  }

  /**
   * Retrieves and decrypts a password by ID
   * Automatically deletes the password after retrieval (one-time use)
   */
  retrievePassword(id: string): string | null {
    const entry = this.storage.get(id);

    if (!entry) {
      return null;
    }

    // Delete from storage BEFORE decrypting (one-time use)
    this.storage.delete(id);

    // Decrypt and return
    return this.cryptoService.decrypt(entry.encryptedPassword);
  }

  /**
   * Get the number of stored passwords (for debugging)
   */
  getStorageSize(): number {
    return this.storage.size;
  }
}
