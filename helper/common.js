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
    idEnc: "W#hDV8xd5p*ZV^OM0(N/3v0*}ze~KSY:E",
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

export const getLevelData = (data) => {
  let temp = "";

  if (data.level == 1) {
    temp = {
      $and: [{ docType: "Bank" }, { level: { $or: getLevel(1) } }],
    };
  } else if (data.level == 2) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: { $or: getLevel(2) } },
        { "address.country": data.address.country },
      ],
    };
  } else if (data.level == 3) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: { $or: getLevel(3) } },
        { "address.state": data.address.state },
      ],
    };
  } else if (data.level == 4) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: { $or: getLevel(4) } },
        { "address.city": data.address.city },
      ],
    };
  } else if (data.level == 5) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: { $or: getLevel(5) } },
        { "address.zone": data.address.zone },
      ],
    };
  }

  return temp;
};
