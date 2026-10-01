export default interface IEncryptionService {
    encryptText(plainText: string): Promise<string>
    decryptText(cipherText: string): Promise<string>
}
