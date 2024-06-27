import { defineStore } from 'pinia'
import { getData, getTotalPageCount } from '../services/EventServices'

export const usePageStore = defineStore('page', {
  state: () => ({
    page: <Array<any>>[],
    currentPage: <number | null>null,
    totalPages: <number | null>null,
    pagesArray: <number[]>[],
  }),
  actions: {
    getCurrentPage() {
      const url = window.location.pathname
      const regex = /(\d+)$/
      const match = url.match(regex)
      if (match && match[1]) {
        return parseInt(match[1], 10)
      } else {
        return null
      }
    },
    async fetchTotalPages() {
      console.log('fetchTotalPages before fetch', this.totalPages)
      this.totalPages = await getTotalPageCount()
      console.log('fetchTotalPages after fetch', this.totalPages)
      if (this.totalPages !== null) {
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, k) => k + 1,
        )
        console.log('pagesArray', this.pagesArray)
      }
    },
    async fetchData(pageNum: number) {
      this.page = await getData(pageNum)
    },
    async initialize() {
      const newPage = this.getCurrentPage()
      if (newPage === this.currentPage) {
        console.log('reload page')
        return await this.fetchTotalPages()
      }
      this.currentPage = newPage
      await this.fetchTotalPages()
      if (this.currentPage !== null) {
        await this.fetchData(this.currentPage)
      }
    },
  },
})
