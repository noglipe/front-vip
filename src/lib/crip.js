import CryptoJS from "crypto-js";

const SECRET_KEY = `${process.env.NEXT_PUBLIC_BACKEND_URL}`; // Guarde com segurança (NÃO no código!)

function strToBuffer(str) {
  return new TextEncoder().encode(str);
}

function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64) {
    return new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    ).buffer;
  }

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
