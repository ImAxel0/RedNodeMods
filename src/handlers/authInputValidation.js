export function validateUsername(username) {
  const errors = [];
  if (username.length < 4) {
    errors.push("Username must be atleast 4 chararacters long");
  }
  if (username.length > 24) {
    errors.push("Username is too long");
  }
  if (username.search(/^[a-z0-9]+$/i) < 0) {
    errors.push("Name must contain only alphanumeric characters");
  }
  return errors;
}

export function validatePassword(password) {
  const errors = [];
  if (password.length < 6) {
    errors.push("Password must be 6 or more characters");
  }
  if (password.search(/[a-z]/i) < 0) {
    errors.push("Password must contain at least one letter");
  }
  if (password.search(/[0-9]/) < 0) {
    errors.push("Password must contain at least one digit");
  }
  return errors;
}

export function validateEmail(email) {
  const errors = [];
  const EMAIL_REGEX =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (!EMAIL_REGEX.test(email)) {
    errors.push("Invalid email");
  }
  return errors;
}
