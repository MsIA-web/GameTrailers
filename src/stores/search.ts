import { defineStore } from 'pinia'
import { getData } from '@/services/EventServices'
import { findPageById } from '../utils/utils'

export const useSearchStore = defineStore('search', {
  state: () => ({
    data: <Array<any>>[],
    searchItems: <Array<any>>[],
    itemsPerPage: <number>5,
    currentPage: <number>1,
    inputValue: <string>'',
    pagesArray: <Array<number>>[],
    routesReady: <boolean>false,
  }),
  actions: {
    async getData() {
      try {
        const data = await getData()
        if (data.length !== 0) this.data = data
      } catch {
        console.error('Error while fetching data items:')
      }
    },
    async addSearchItems(query: string) {
      try {
        const queryUpper = query.toUpperCase()

        if (queryUpper === '') {
          this.searchItems = []
        } else {
          this.inputValue = query

          this.searchItems = this.data.filter((item) =>
            item.title.toUpperCase().includes(queryUpper),
          )

          this.searchItems.forEach((item) => {
            item.pageNumber = findPageById(item.id)
          })
        }

        this.currentPage = 1
      } catch {
        console.error('Error while adding search items:')
      }
    },
    async paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.searchItems.slice(start, end)
    },
    async totalPages(): Promise<number> {
      return Math.ceil(this.searchItems.length / this.itemsPerPage)
    },
    async fetchTotalPages() {
      try {
        const numberPages = await this.totalPages()
        if (numberPages && Number.isInteger(numberPages) && numberPages > 0) {
          this.pagesArray = Array.from({ length: numberPages }, (_, k) => k + 1)
        } else {
          console.warn('Invalid number of pages:', numberPages)
          this.pagesArray = []
        }
      } catch (error) {
        console.error('Error while fetching total pages:', error)
      }
    },
    reduceCurrentPage(): void {
      if (this.currentPage > 1) this.currentPage--
    },
    setCurrentPage(pageNum: number): void {
      this.currentPage = pageNum
    },
    increaseCurrentPage(): void {
      if (this.currentPage < this.pagesArray.length) this.currentPage++
    },
  },
  persist: true,
})
