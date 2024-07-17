import axios from 'axios'

const itemsPerPage: number = 5

async function getPageData(currentPage: number): Promise<any> {
  try {
    const response = await axios.get(
      `https://0a48175ddb6f7777.mokky.dev/games?page=${currentPage}&limit=5`,
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

export { getPageData, getTotalPageCount, getTotalItemsCount }
