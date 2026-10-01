"use server"

import CryptoJS from 'crypto-js'

const aesKey = process.env.AES_KEY ?? ''

function bytesToWordArray(u8: Uint8Array) {
    const words: number[] = []
    let i = 0
    const len = u8.length
    while (i < len) {
        words[i >>> 2] |= u8[i] << (24 - (i % 4) * 8)
        i++
    }
    return CryptoJS.lib.WordArray.create(words, len)
}

export async function encryptText(plainText: string): Promise<string> {
    const textEncoder = new TextEncoder()
    const keyArr = textEncoder.encode(aesKey)

    const keyArrBytes32Value = new Uint8Array(32)
    keyArrBytes32Value.set(keyArr.slice(0, 32))

    const ivArr = [1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 7, 7, 7, 7]
    const iVBytes16Value = new Uint8Array(16)
    iVBytes16Value.set(ivArr.slice(0, 16))

    const key = bytesToWordArray(keyArrBytes32Value)
    const iv = bytesToWordArray(iVBytes16Value)

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    })

    return encrypted.toString()
}

export async function decryptText(cipherText: string): Promise<string> {
    const textEncoder = new TextEncoder()
    const keyArr = textEncoder.encode(aesKey)

    const keyArrBytes32Value = new Uint8Array(32)
    keyArrBytes32Value.set(keyArr.slice(0, 32))

    const ivArr = [1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 7, 7, 7, 7]
    const iVBytes16Value = new Uint8Array(16)
    iVBytes16Value.set(ivArr.slice(0, 16))

    const key = bytesToWordArray(keyArrBytes32Value)
    const iv = bytesToWordArray(iVBytes16Value)

    const encrypted = CryptoJS.AES.decrypt(cipherText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    })

    return encrypted.toString(CryptoJS.enc.Utf8)
}
