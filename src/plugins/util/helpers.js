import { uiUrl } from '@/config'

export const generatePassword = () => {
  const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789`
  const getRandomIndex = xs => Math.floor(Math.random() * ((xs.length - 1) + 1))
  const getCode = chars => Array(8).fill(null).map(_ => chars[getRandomIndex(chars)]).join(``)
  return getCode(chars)
}

export const logout = () => {
  try {
    const vuex = JSON.parse(localStorage.getItem(`vuex`))
    vuex.session.active.status.isLoggedIn = false
    vuex.session.active.status.token = ``
    vuex.session.active.user = null
    vuex.session.active.fileName = ``
    vuex.session.active.isImporting = false
    localStorage.setItem(`vuex`, JSON.stringify(vuex))
    window.location.href = uiUrl
  } catch (e) {
    console.error(e)
  }
}

// export const logout = () => {
//   try {
//     const vuex = JSON.parse(localStorage.getItem(`vuex`))
//     console.log(`TCL: logout -> vuex`, vuex)
//     vuex.session.active.status.isLoggedIn = false
//     vuex.session.active.status.token = ``
//     vuex.session.active.user = null
//     localStorage.setItem(`vuex`, JSON.stringify(vuex))
//     window.location.href = uiUrl
//   } catch (error) {
//     console.error(`❌ Error in 'helpers.js ➡ logout'.`, error)
//   }
// }

export const getToken = () => {
  const vuex = localStorage.getItem(`vuex`)
  const token = vuex ? JSON.parse(vuex).session.active.status.token : ``
  return token
}

// console.error(`❌ Error in 'helpers.js ➡ isUnauthorizedError'.`, error)
export const isUnauthorizedError = err => {
  // return err.networkError.statusCode === 401
  try {
    return err.graphQLErrors[0].extensions.code === `UNAUTHENTICATED`
  } catch (error) {
    return false
  }
}

export default {
  generatePassword,
  logout,
  getToken,
  isUnauthorizedError
}
