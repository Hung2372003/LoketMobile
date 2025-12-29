import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import * as Keychain from 'react-native-keychain';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export class CryptoService {
  private static instance: CryptoService;
  private privateKey: string | null = null;
  private publicKey: string | null = null;
  private serverPublicKey: string | null = null;

  private constructor() {}

  public static getInstance(): CryptoService {
    if (!CryptoService.instance) {CryptoService.instance = new CryptoService();}
    return CryptoService.instance;
  }

  // ================= CLIENT KEYS =================
  public async initClientKeys(): Promise<RSAKeyPair> {
    const saved = await Keychain.getGenericPassword({ service: 'rsaClientKey' });
    if (saved) {
      this.privateKey = saved.password;
      this.publicKey = saved.username;
      return { privateKey: this.privateKey, publicKey: this.publicKey };
    }
    return await this.generateClientKeys();
  }

  public async generateClientKeys(): Promise<RSAKeyPair> {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    this.privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    this.publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    await Keychain.setGenericPassword(this.publicKey, this.privateKey, { service: 'rsaClientKey' });
    return { privateKey: this.privateKey, publicKey: this.publicKey };
  }

  public getPrivateKey(): string | null { return this.privateKey; }
  public getPublicKey(): string | null { return this.publicKey; }

  // ================= SERVER PUBLIC =================
  public setServerPublicKey(key: string) { this.serverPublicKey = key; }
  public getServerPublicKey(): string | null { return this.serverPublicKey; }

  // ================= RSA =================
  public encryptForServer(data: string): string {
    if (!this.serverPublicKey) {throw new Error('Server public key not set');}
    const pubKey = forge.pki.publicKeyFromPem(this.serverPublicKey);
    const encrypted = pubKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha1.create(),
      mgf1: { md: forge.md.sha1.create() },
    });
    return forge.util.encode64(encrypted);
  }

  public decryptWithPrivateKey(encryptedBase64: string): string {
    if (!this.privateKey) {throw new Error('Private key not set');}
    const privKey = forge.pki.privateKeyFromPem(this.privateKey);
    const decrypted = privKey.decrypt(forge.util.decode64(encryptedBase64), 'RSA-OAEP', {
      md: forge.md.sha1.create(),
      mgf1: { md: forge.md.sha1.create() },
    });
    return decrypted;
  }

  // ================= AES =================
  public generateAESKey(): string {
    const bytes = new Uint8Array(forge.random.getBytesSync(32).split('').map(c => c.charCodeAt(0)));
    return this.uint8ArrayToBase64(bytes);
  }

  public encryptWithAES(plaintext: string, aesKeyBase64: string): string {
    const key = CryptoJS.enc.Base64.parse(aesKeyBase64);
    const ivBytes = new Uint8Array(forge.random.getBytesSync(16).split('').map(c => c.charCodeAt(0)));
    const ivWA = CryptoJS.lib.WordArray.create(ivBytes);

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    const cipherBytes = new Uint8Array(encrypted.ciphertext.words.length * 4);
    for (let i = 0; i < encrypted.ciphertext.words.length; i++) {
      cipherBytes[i * 4 + 0] = (encrypted.ciphertext.words[i] >> 24) & 0xff;
      cipherBytes[i * 4 + 1] = (encrypted.ciphertext.words[i] >> 16) & 0xff;
      cipherBytes[i * 4 + 2] = (encrypted.ciphertext.words[i] >> 8) & 0xff;
      cipherBytes[i * 4 + 3] = (encrypted.ciphertext.words[i]) & 0xff;
    }

    const combined = this.concatUint8Arrays(ivBytes, cipherBytes);
    return this.uint8ArrayToBase64(combined);
  }

  public decryptWithAES(base64Data: string, aesKeyBase64: string): string {
    const key = CryptoJS.enc.Base64.parse(aesKeyBase64);
    const bytes = this.base64ToUint8Array(base64Data);

    const ivBytes = bytes.slice(0, 16);
    const cipherBytes = bytes.slice(16);

    const ivWA = CryptoJS.lib.WordArray.create(ivBytes);
    const cipherWA = CryptoJS.lib.WordArray.create(cipherBytes);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherWA } as any, key, {
      iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  // ================= HELPERS =================
  private concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    const c = new Uint8Array(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }
// Uint8Array → Base64
// Uint8Array → chuẩn Base64
private uint8ArrayToBase64(u8: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < u8.length; i += chunkSize) {
    const chunk = u8.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  // global.btoa đôi khi thiếu padding, đảm bảo padding đầy đủ
  let b64 = global.btoa(binary);
  while (b64.length % 4 !== 0) b64 += '=';
  return b64;
}

// Base64 → Uint8Array
private base64ToUint8Array(b64: string): Uint8Array {
  const binary = global.atob(b64);
  const u8 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);
  return u8;
}



}
