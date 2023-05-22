const crypto = require("crypto");

export const checkName = (string) => /^[a-z ,.'-]+$/i.test(string);

export const checkEmail = (string) =>
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);

export const checkPassword = (string) =>
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(string);

export function enc(textToEncrypt, secret) {
  var iv = secret.substr(0, 16);
  var encryptor = crypto.createCipheriv("aes-256-ctr", secret, iv);
  return (
    encryptor.update(textToEncrypt, "utf8", "base64") +
    encryptor.final("base64")
  );
}

export function dec(encryptedMessage, secret) {
  var iv = secret.substr(0, 16);
  var decryptor = crypto.createDecipheriv("aes-256-ctr", secret, iv);
  return (
    decryptor.update(encryptedMessage, "base64", "utf8") +
    decryptor.final("utf8")
  );
}

export function keyStore(a) {
  const q = {
    empPsw: "Y#hD5xd1p*ZV^OM0(N/3v0*}ze~VAK:E",
  };
  return q[a];
}

export const getLevel = (lvl) => {
  const temp = [];
  for (let i = lvl; i <= 5; i++) {
    temp.push(i);
  }
  return temp;
};

export function convertToNestedTree(data) {
  const dataObj = {};
  let root;

  data.map((item) => {
    const { _id } = item;
    item.children = [];
    dataObj[_id] = item;
  });

  data.map((item) => {
    const { parentalId } = item;
    if (parentalId) {
      const parent = dataObj[parentalId];
      if (parent) {
        parent.children.push(item);
      }
    } else {
      root = item;
    }
  });

  return Array.isArray(root) ? root : [root];
}
