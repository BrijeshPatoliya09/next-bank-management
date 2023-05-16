const checkName = (string) => /^[a-z ,.'-]+$/i.test(string);

const checkEmail = (string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);

const checkPassword = (string) =>
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(string);

