const resetCodes = new Map(); 

function setResetCode(email, code) {
  const expiresAt = Date.now() + 5 * 60 * 1000; 
  resetCodes.set(email, { code, expiresAt });
}

function getResetCode(email) {
  const data = resetCodes.get(email);
  if (!data) return null;
  if (Date.now() > data.expiresAt) {
    resetCodes.delete(email);
    return null;
  }
  return data.code;
}

function deleteResetCode(email) {
  resetCodes.delete(email);
}

module.exports = { setResetCode, getResetCode, deleteResetCode };