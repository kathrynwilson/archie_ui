import { gql }               from 'apollo-boost'
import * as gqb              from 'gql-query-builder'
import lowerCase             from 'lodash/lowerCase'
import { map, keys, values } from 'lodash'
import states                from '@/static/lookup/states.usa'

// Verify that input text is actually a state, either by its full name or its abbreviated name
// ✅ Valid: `Alaska`, `alaska`, `AK`, `ak`, etc.
// ❌ Invalid: `Alasska`, ``a.k.`, `A K`, etc.
const checkState = input => states.some(item =>
  lowerCase(item.full) === input
  || lowerCase(item.abbr) === input)

// Converts input (ideally, a US State) to its alternate form (full name <-> abbreviated name)
// 📌 Example: `Alaska` -> `AK`
// 📌 Example: `AK` -> `Alaska`
const convertState = input => {
  const state = lowerCase(input) // Strip special characters and covert to lowercase
  const checked = checkState(state) // Make sure the input is actually a state

  // Return the appropriate form
  return checked
    ? state.length === 2
      ? states.find(item => lowerCase(item.abbr) === state).full
      : states.find(item => lowerCase(item.full) === state).abbr
    : null
}

const convertStringToGql = input => gql`${input.replace(`"`, `\``)}`

const makeQuery = input => {
  const result = gqb.query(input)
  const query = convertStringToGql(result.query)
  const { variables } = result

  return { query, variables }
}

// Converts an object of key-value pairs to an array of objects
// with individual properties for the original key and value
// 📌 Example: { foo: `bar` } -> [{ key: `foo`, value: `bar` }]
const convertObjToArr = input =>
  map(input, (value, prop) => ({
    key: prop,
    value
  }))

const roundToNearest = (step, input) => (Math.round(input / step) * step) / 100

// Takes a numeric value and an object that contains color values
// with their respective ranges, and returns the color for the range
// in which the value falls
const getColor = (value, collection) => {
  // Check if it's a decimal percentage; if not, make it so
  const decimal = value / 100 < 1 ? value : value / 100
  const rounded = roundToNearest(20, decimal)

  const { color } = collection.find(item =>
    item.min <= rounded && rounded <= item.max)
  return color
}

const castRecordAsString = arr =>
  arr.map(record =>
    values(record).map(entry =>
      `"${entry}"`).join(`,`))

const convertTableToCSV = rows => {
  const cols = [keys(rows[0])]

  return [cols, rows].map(arr =>
    castRecordAsString(arr))
    .flat()
    .join(`\r\n`)
    .toString()
}

export default {
  checkState,
  convertObjToArr,
  convertStringToGql,
  convertState,
  convertTableToCSV,
  getColor,
  makeQuery
}
