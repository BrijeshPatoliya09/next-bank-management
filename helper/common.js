const crypto = require("crypto");

export const checkName = (string) => /^[a-z ,.'-]+$/i.test(string);

export const checkEmail = (string) =>
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);

const characterLength = /^[a-zA-Z0-9@\#$%&*()_+\]\[';:?.,!^-]{8,32}$/;
const lowercaseLetter = /(?=.*[a-z])/;
const uppercaseLetter = /(?=.*[A-Z])/;
const number = /(?=.*\d)/;
const special = /(?=.*\W)/;

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
    idEnc: "Y#hH9xd1l*ZV^ON0(N/6v0*}ze~BAT:E",
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

export const filterFunction = (filter, data) => {
  let temp = {};
  Object.keys(filter).forEach((item) => {
    if (filter[item] || filter[item] != "" || filter[item].length > 0) {
      temp[item] = filter[item];
    }
  });

  let tempData;
  if (temp) {
    tempData = data.filter((item) => {
      let dummy = "";
      for (const key in temp) {
        if (key == "createdAt") {
          if (dummy) {
            dummy =
              dummy +
              " && " +
              `${item[key]} >= ${temp[key][0]} &&
              ${item[key]} <= ${temp[key][1]}`;
          } else {
            dummy =
              dummy +
              " " +
              `${item[key]} >= ${temp[key][0]} &&
              ${item[key]} <= ${temp[key][1]}`;
          }
        } else {
          if (dummy) {
            dummy =
              dummy +
              " && " +
              `item.${key}.toLowerCase().includes("${temp[
                key
              ].toLowerCase()}")`;
          } else {
            dummy =
              dummy +
              " " +
              `item.${key}.toLowerCase().includes("${temp[
                key
              ].toLowerCase()}")`;
          }
        }
      }
      return eval(dummy);
    });
  } else {
    tempData = [...data];
  }

  return tempData;
};

export async function dataSorting(obj, filteredData, page) {
  const fld = Object.keys(obj)[0];
  let finaldata = [];
  if (filteredData.length > 0) {
    if (obj[fld] == 0) {
      finaldata = filteredData.sort((a, b) =>
        a[fld] > b[fld] ? -1 : b[fld] > a[fld] ? 1 : 0
      );
    } else {
      finaldata = filteredData.sort((a, b) =>
        a[fld] > b[fld] ? 1 : b[fld] > a[fld] ? -1 : 0
      );
    }
  }
  return await finaldata.slice(page * 10, page * 10 + 10);
}

export const addPswHandler = (text, valid) => {
  if (characterLength.test(text)) {
    valid((item) => ({
      ...item,
      length: true,
    }));
  } else {
    valid((item) => ({
      ...item,
      length: false,
    }));
  }

  if (lowercaseLetter.test(text)) {
    valid((item) => ({
      ...item,
      lower: true,
    }));
  } else {
    valid((item) => ({
      ...item,
      lower: false,
    }));
  }

  if (number.test(text)) {
    valid((item) => ({
      ...item,
      digit: true,
    }));
  } else {
    valid((item) => ({
      ...item,
      digit: false,
    }));
  }

  if (uppercaseLetter.test(text)) {
    valid((item) => ({
      ...item,
      upper: true,
    }));
  } else {
    valid((item) => ({
      ...item,
      upper: false,
    }));
  }

  if (special.test(text)) {
    valid((item) => ({
      ...item,
      spacial: true,
    }));
  } else {
    valid((item) => ({
      ...item,
      spacial: false,
    }));
  }
};

export const getTreeData = async (address, level) => {
  const res = await fetch(`${process.env.apiUrl}/admin/bank/getTreeData`, {
    method: "PUT",
    body: JSON.stringify({
      bankData: {
        address,
        level,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
