const toKeyValRe = /((?:\[)[^\]]*(?:\])|(?:(?:(?:},\s*?[^=]{)|,|^)\s*?\w*=))/
const structRe = /^{.*?(?:(?:(?:},\s*?{)|,|{|)\s*?(?:\w+)=).*?}$/
const looseStructRe = /{.*?(?:(?:(?:},\s*?{)|,|{|)\s*?(?:\w+)=).*?}/

const cleanKey = (key) => {
  const match = /(\w+)=/.exec(key)

  return match[1]
}

const isArray = (value) => value[0] === '[' && value[value.length - 1] === ']'
const isStruct = (value) => structRe.test(value.trim())
const isNumber = num => !isNaN(num)

const parseValue = (value) => {
  if (value === 'false') {
    return false
  } else if (value === 'true') {
    return true
  } else if (value === 'null') {
    return null
  } else if (isNumber(value)) {
    return parseNumber(value)
  } else if (isArray(value)) {
    return parseArray(value).map(val => parseValue(val))
  } else if (isStruct(value)) {
    return parseStruct(value)
  }

  return value
}

const ObjectStates = {
  KEY: 'key',
  VALUE: 'value'
}

const parseStruct = (struct) => {
  const trimmed = struct.trim()
  struct = trimmed.substr(1).substr(0, struct.length - 2).trim()
  const [
    ,
    ...keyValuePairs
  ] = struct.split(toKeyValRe)
  const obj = {}

  // We always start with a key.
  const state = {
    type: ObjectStates.KEY
  }
  for (var i = 0; i < keyValuePairs.length; i++) {
    const item = keyValuePairs[i]

    if (item.trim() === '') {
      continue
    }

    if (
      state.type === ObjectStates.KEY &&
      item === '' &&
      keyValuePairs[i - 1] &&
      keyValuePairs[i - 1][0] === '['
    ) {
      // Key if an empty value after an array.
      continue
    }

    if (state.type === ObjectStates.KEY) {
      state.key = cleanKey(item)
      state.type = ObjectStates.VALUE
      continue
    }

    if (
      state.type === ObjectStates.VALUE &&
      item === '' &&
      keyValuePairs[i + 1] &&
      keyValuePairs[i + 1][0] === '['
    ) {
      // Value is an empty value before an array.
      continue
    }

    if (state.type === ObjectStates.VALUE) {
      const { key } = state
      delete state.key
      obj[key] = parseValue(item)
      state.type = ObjectStates.KEY
      continue
    }
  }

  return obj
}

const splitByBoundingChars = (value, leftChar, rightChar) => {
  const list = []

  let depth = 0
  let str = ''
  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    if (depth !== 0) {
      str = `${str}${char}`
    }

    if (char === leftChar) {
      depth += 1
      str = leftChar
      continue
    } else if (depth === 0) {
      continue
    }

    if (char === rightChar) {
      depth -= 1
    }

    if (depth === 0) {
      // We're back at 0 depth.
      list.push(str)
      str = ''
    }
  }

  return list
}

const parseArray = (value) => {
  // Arrays should always contain the same data type, thus once we determine what it is,
  // we use the appropriate approach to split into strings.

  const noBrackets = value.trim().substr(1).substr(0, value.length - 2)

  if (looseStructRe.test(noBrackets)) {
    // Value contains at least one struct.
    // Assume all structs.
    return splitByBoundingChars(noBrackets, '{', '}')
  } else if (isArray(noBrackets)) {
    return splitByBoundingChars(noBrackets, '[', ']')
  }

  // Value can only be a primitive, split regularly.
  return noBrackets.split(/,\s*/)
}

const parseNumber = (value) => Number(value)

module.exports = parseValue
module.exports.default = parseValue
