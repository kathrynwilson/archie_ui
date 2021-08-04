/* eslint-disable import/no-extraneous-dependencies */
import Vue                                       from 'vue'
import VueApollo                                 from 'vue-apollo'
import { ApolloClient }                          from 'apollo-client'
import { HttpLink }                              from 'apollo-link-http'
import { ApolloLink, concat, from }              from 'apollo-link'
import { InMemoryCache }                         from 'apollo-cache-inmemory'
import { onError }                               from 'apollo-link-error'
import { endpoint }                              from '@/config'
import { logout, getToken, isUnauthorizedError } from '@/plugins/util/helpers'
// import { logout, getToken } from '@/plugins/util/helpers'

Vue.use(VueApollo)

// List of fields for which Apollo will have specific processing logic
const fields = {
  // Exclude `__typename` when returning query results
  addTypename: false
}

const httpLink = new HttpLink({ uri: endpoint })
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({ headers: { "access-token": getToken() } })
  return forward(operation)
})

const afterware = onError(errorObj => {
  const { forward, operation } = errorObj
  if (isUnauthorizedError(errorObj)) return logout()
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link:              concat(authMiddleware, afterware.concat(httpLink)),
  cache:             new InMemoryCache(fields),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default apolloProvider
