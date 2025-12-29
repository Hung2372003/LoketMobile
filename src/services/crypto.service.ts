import RSA from 'react-native-rsa-native';
import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export class CryptoService {
  private static instance: CryptoService;

  // 🔐 Client keys
  private privateKey: string | null = null;
  private publicKey: string | null = null;

  // 🏛 Server public key
  private serverPublicKey: string | null = null;

  private constructor() {}

  public static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  // ================= SERVER PUBLIC KEY =================

  /** Gọi từ SignalR / API khi nhận public key server */
  public setServerPublicKey(key: string) {
    this.serverPublicKey = key;
  }

  public getServerPublicKey(): string | null {
    return this.serverPublicKey;
  }

  // ================= RSA CLIENT KEY =================

  public async initKeys(): Promise<RSAKeyPair> {
    const saved = await Keychain.getGenericPassword({
      service: 'rsaPrivateKey',
    });

    if (saved) {
      this.privateKey = saved.password;
      this.publicKey = ''; // sẽ gửi public key này lên server khi cần
      return {
        publicKey: this.publicKey!,
        privateKey: this.privateKey!,
      };
    }

    return await this.generateKeys();
  }

  private async generateKeys(): Promise<RSAKeyPair> {
    const keyPair = await (RSA as any).generateKeys(2048);

    this.privateKey = keyPair.private;
    this.publicKey = keyPair.public;

    await Keychain.setGenericPassword('rsa', this.privateKey!, {
      service: 'rsaPrivateKey',
    });

    return {
      publicKey: this.publicKey!,
      privateKey: this.privateKey!,
    };
  }

  public getPrivateKey(): string | null {
    return this.privateKey;
  }

  public getPublicKey(): string | null {
    return this.publicKey;
  }

  // ================= RSA =================

  /** 🔐 Encrypt AES key bằng PUBLIC KEY CỦA SERVER */
  public async encryptForServer(data: string): Promise<string> {
    if (!this.serverPublicKey) {
      throw new Error('Server public key not set');
    }
    return await (RSA as any).encrypt(data, this.serverPublicKey);
  }

  /** 🔓 Decrypt AES key server trả về */
  public async decryptWithPrivateKey(data: string): Promise<string> {
    if (!this.privateKey) {
      throw new Error('Private key not initialized');
    }
    return await (RSA as any).decrypt(data, this.privateKey);
  }

  // ================= AES =================

  /** 🔑 AES-256 key (Base64) */
  public generateAESKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
  }

  /** 🔒 Encrypt → Base64(IV + Cipher) */
  public encryptWithAES(plaintext: string, aesKeyBase64: string): string {
    const key = CryptoJS.enc.Base64.parse(aesKeyBase64);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const combined = iv.clone().concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  }

  /** 🔓 Decrypt Base64(IV + Cipher) */
  public decryptWithAES(base64Data: string, aesKeyBase64: string): string {
    const key = CryptoJS.enc.Base64.parse(aesKeyBase64);
    const data = CryptoJS.enc.Base64.parse(base64Data);

    const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4), 16);
    const cipher = CryptoJS.lib.WordArray.create(
      data.words.slice(4),
      data.sigBytes - 16
    );

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: cipher } as any,
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
