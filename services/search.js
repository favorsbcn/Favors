import algoliasearch from 'algoliasearch'
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY } from 'react-native-dotenv'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
const index = client.initIndex('users')

export async function searchUsers(query) {
  const response = await index.search({ query })
  return response.hits
} 