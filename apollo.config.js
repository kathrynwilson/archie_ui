module.exports = {
  client: {
    service: {
      name: `my-graphql-app`,
      url: require(`./config`).endpoint // eslint-disable-line
    }
  }
}
