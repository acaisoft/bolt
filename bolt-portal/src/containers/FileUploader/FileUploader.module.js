/**
 * Copyright (c) 2022 Acaisoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import CryptoJS from 'crypto-js'

export const readFile = async (file, mode = 'binary-string') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = e => reject(e.target.error)

    switch (mode) {
      case 'binary-string':
        reader.readAsBinaryString(file)
        break
      case 'data-url':
        reader.readAsDataURL(file)
        break
      default:
    }
  })
}

export const uploadFileToGCS = async ({ file, url, fileHash }) => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Content-MD5': fileHash,
    },
    body: file,
  })

  if (res.status >= 400) {
    let errorBody
    try {
      errorBody = await res.text() // GCS responds with XML. TODO: Parse message
    } catch (ex) {
      errorBody = 'Unknown error'
    }
    throw new Error('File upload failed:', errorBody)
  }
  return res
}

export const getFileHash = async loadedFile => {
  const latinContents = CryptoJS.enc.Latin1.parse(loadedFile)
  const md5 = CryptoJS.MD5(latinContents)
  return md5.toString(CryptoJS.enc.Base64)
}
