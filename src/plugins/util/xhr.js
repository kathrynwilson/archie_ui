const fp = require(`lodash/fp`)

export const post = (url, body, token) => fetch(url, {
  method:  `POST`,
  body:    JSON.stringify(body),
  headers: {
    "access-token": token,
    "Content-Type": `application/json`
  }
})
  .then(r => r.json())

export const handleError = err => {
  try {
    const errorMessage = fp.tail(err.message.split(`:`))
    alert(errorMessage) // eslint-disable-line
  } catch (e) {
    alert(`incorrect username or password`)
  }
}

export default {
  post,
  handleError
}
