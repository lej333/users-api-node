const _ = require('lodash');
const crypto = require('crypto');

const analyze = (options = {}) => {
  const secureKey = 'ee42188b-e74b-4305-b964-88a3e203e32d';
  const secureType = 'sha256';
  const secureFields = 'contactId'
  if (secureKey) {
    const hmac = crypto.createHmac(secureType, secureKey);
    let dataObj = {};
    if (Array.isArray(secureFields)) {
      for (let l = 0; l < secureFields.length; l++) {

      }
      hmac.update(JSON.stringify(dataObj));
    } else {
      let value = getKeyInObject(options.data, secureFields);
      if (!value) {
        this.log('error', `the field ${secureFields} does not exist in the data`);
        return false;
      }
      hmac.update(value);
    }
    let hash = hmac.digest('hex').toUpperCase();
    console.log(hash)
  }
}

const getKeyInObject = (object, keyString, defaultValue = undefined)  => {
  if (!Array.isArray(keyString)) {
    keyString = keyString.split('.')
  }
  let result = object;
  for (let index = 0; index < keyString.length; index++) {
    let key = keyString[index];
    if (result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      let bracketStart = key.indexOf('[');
      let bracketEnd = key.indexOf(']')
      if (bracketStart < 0 || bracketEnd < 0) {
        break;
      } else {
        let keyName = key.substring(0, bracketStart)
        if (result.hasOwnProperty(keyName)) {
          result = result[keyName];
          let index = key.substring(bracketStart + 1, bracketEnd).trim();
          if (result.hasOwnProperty(index)) {
            result = result[index]
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
    if (index === keyString.length - 1) {
      return result;
    }
  }
  return defaultValue
}


const data = {
  data: {
    contactId: '1336'
  }
}
console.log(analyze(data));