function generateUniqueUsername(username) {
  return `${username}.${Date.now()}`;
}
module.exports = { generateUniqueUsername };
