import RNCryptor from "jscryptor";
import { ENC_DEC_KEY } from '../../Config';
const Encryption = {
  async Encrypt(sendData) {
    var enc = RNCryptor.Encrypt(JSON.stringify(sendData), ENC_DEC_KEY);
    return enc;
  },
  async Decrypt(receiveData) {
    var dec = RNCryptor.Decrypt(receiveData, ENC_DEC_KEY);
    const receiveSecureData = JSON.parse(dec);
    console.log("receiveSecureData", receiveSecureData);
    return receiveSecureData;
  },
};

export default Encryption;
