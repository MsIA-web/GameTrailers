import axios from 'axios'
import { filterByWordStart } from '../utils/utils'

const itemsPerPage: number = 5

async function getData(): Promise<any> {
  try {
    const response = await axios.get(`https://0a48175ddb6f7777.mokky.dev/games`)
    return response.data
  } catch (error) {
    console.error('Error while fetching data items:', error)
    throw error
  }
}

async function getPageData(currentPage: number): Promise<any> {
  try {
    const response = await axios.get(
      `https://0a48175ddb6f7777.mokky.dev/games?sortBy=-id&page=${currentPage}&limit=5`,
    )
    return response.data.items
  } catch (error) {
    console.error('Error while fetching page data items:', error)
    throw error
  }
}

async function getTotalItemsCount(): Promise<number> {
  try {
    const response = await axios.get('https://0a48175ddb6f7777.mokky.dev/games')
    return response.data.length
  } catch (error) {
    console.error('Error while fetching total items count:', error)
    throw error
  }
}

async function getTotalPageCount(): Promise<number> {
  const totalItemsCount = await getTotalItemsCount()
  return Math.ceil(totalItemsCount / itemsPerPage)
}

async function getSearchResult(searchQuery: string): Promise<any> {
  try {
    const response = await axios.get(
      `https://0a48175ddb6f7777.mokky.dev/games?title=*${searchQuery}*`,
    )
    const filterResponse = filterByWordStart(response.data, searchQuery)
    return filterResponse
  } catch (error) {
    console.error('Error while fetching search result:', error)
  }
}

async function getTags(): Promise<any> {
  try {
    const response = await axios.get('https://0a48175ddb6f7777.mokky.dev/tags')
    return response.data
  } catch (error) {
    console.error('Error while fetching tags:', error)
  }
}

export {
  getPageData,
  getTotalPageCount,
  getTotalItemsCount,
  getData,
  getSearchResult,
  getTags,
}
