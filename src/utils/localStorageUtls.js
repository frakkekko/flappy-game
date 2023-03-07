function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export { setStorage, getStorage };
