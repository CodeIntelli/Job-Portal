// creating token and saving in cookie
import { COOKIE_EXPIRE } from "../../Config";
import Encryption from "./Encryption";
const sendToken = async (user, statusCode, res) => {
  const token = user.getJWTToken();
  //   Option for cookie
  const option = {
    expires: new Date(Date.now() + COOKIE_EXPIRE * 24 * 24 * 60 * 1000),
    httpOnly: true,
  };
  let successMessage = await Encryption.Encrypt({
    success: true,
    user,
    token,
  })
  res.status(statusCode).cookie("token", token, option).json({secureData:successMessage});
};

export default sendToken;
