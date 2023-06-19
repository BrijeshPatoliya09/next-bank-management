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
    userPsw: "X#lA5xE8p*ZV^KD5(N/6c0*}ze~LWU:E",
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

export const getLevelData = (data, parent) => {
  let temp = "";

  if (data.level == 1) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: !parent ? { $or: getLevel(1) } : 1 },
      ],
    };
  } else if (data.level == 2) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: !parent ? { $or: getLevel(2) } : 2 },
        { "address.country": data.address.country },
      ],
    };
  } else if (data.level == 3) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: !parent ? { $or: getLevel(3) } : 3 },
        { "address.state": data.address.state },
      ],
    };
  } else if (data.level == 4) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: !parent ? { $or: getLevel(4) } : 4 },
        { "address.city": data.address.city },
      ],
    };
  } else if (data.level == 5) {
    temp = {
      $and: [
        { docType: "Bank" },
        { level: !parent ? { $or: getLevel(5) } : 5 },
        { "address.zone": data.address.zone },
      ],
    };
  }

  return temp;
};

export const generateIFSC = (name) => {
  let temp;
  if (name.includes("(")) {
    temp = name.split("(")[0].trim();
  } else {
    temp = name;
  }

  const temp2 = temp.split(" ").map((item) => {
    const letter = item.split("");
    return letter[0].toUpperCase();
  });

  let temp3 = temp2.join("") + (Math.random() * 99999999999).toFixed();

  if (temp3.length > 11) {
    temp3 = temp3.substring(0, 11);
  }

  return temp3;
};

export const imgUploadHandler = async (imgData) => {
  const formData = new FormData();
  formData.append("file", imgData);

  const res = await fetch(`${process.env.apiUrl}/user/fileUpload/proofImage`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.imgUrl;
};

export const loanDocUploadHandler = async (doc) => {
  const formData = new FormData();
  formData.append("file", doc);

  const res = await fetch(`${process.env.apiUrl}/user/fileUpload/loanDoc`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.imgUrl;
};

export const collateralDocUploadHandler = async (doc) => {
  const formData = new FormData();
  formData.append("file", doc);

  const res = await fetch(
    `${process.env.apiUrl}/user/fileUpload/collateralDoc`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.imgUrl;
};

export const removeImgHandler = async (imgData) => {
  const res = await fetch(`${process.env.apiUrl}/user/fileUpload/docRemove`, {
    method: "POST",
    body: JSON.stringify(imgData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
};
