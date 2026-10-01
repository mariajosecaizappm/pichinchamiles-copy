import { injectable } from 'inversify'
import 'reflect-metadata'
import type IEncryptionService from '@/domain/services/IEncryptionService'
import { decryptText, encryptText } from '@/data/provider/crypto/actions'

@injectable()
export default class EncryptionService implements IEncryptionService {
    encryptText(plainText: string): Promise<string> {
        return encryptText(plainText)
    }

    decryptText(cipherText: string): Promise<string> {
        return decryptText(cipherText)
    }
}
