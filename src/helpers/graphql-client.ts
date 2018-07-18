
import unfetch from 'unfetch'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { graphqlAudience } from 'labels'

const client = new ApolloClient({
  link: new HttpLink({
    // See webpack.config.js for actual GRAPHQL_URL endpoints
    uri: process.env.GRAPHQL_URL || 'https://prod.voamobileendpoints.com/server/graphql',
    fetch: unfetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      variables: {
        source: graphqlAudience,
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  },
})

export default client
