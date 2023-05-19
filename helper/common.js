const checkName = (string) => /^[a-z ,.'-]+$/i.test(string);

const checkEmail = (string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);

const checkPassword = (string) =>
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(string);

export const getLevel = (lvl) => {
  const temp = [];
  for (let i = lvl; i < 5; i++) {
    temp.push(i + 1);
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
