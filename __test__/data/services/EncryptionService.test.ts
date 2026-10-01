import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
    const encryptText = vi.fn()
    const decryptText = vi.fn()
    return { encryptText, decryptText }
})

vi.mock('@/data/provider/crypto/actions', () => ({
    encryptText: mocks.encryptText,
    decryptText: mocks.decryptText,
}))

import EncryptionService from '@/data/services/EncryptionService'

describe('data/services/EncryptionService', () => {
    beforeEach(() => {
        mocks.encryptText.mockReset()
        mocks.decryptText.mockReset()
    })

    it('should delegate encryptText to crypto actions', async () => {
        mocks.encryptText.mockResolvedValueOnce('cipher')
        const service = new EncryptionService()
        await expect(service.encryptText('plain')).resolves.toBe('cipher')
        expect(mocks.encryptText).toHaveBeenCalledWith('plain')
    })

    it('should delegate decryptText to crypto actions', async () => {
        mocks.decryptText.mockResolvedValueOnce('plain')
        const service = new EncryptionService()
        await expect(service.decryptText('cipher')).resolves.toBe('plain')
        expect(mocks.decryptText).toHaveBeenCalledWith('cipher')
    })
})
