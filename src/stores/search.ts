import { defineStore } from 'pinia'
import { getData } from '@/services/EventServices'
import { findPageById } from '../utils/utils'

interface Tags {
  tag: string
  active: boolean
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    data: <Array<any>>[],
    searchItems: <Array<any>>[],
    itemsPerPage: <number>5,
    currentPage: <number>1,
    inputValue: <string>'',
    pagesArray: <Array<number>>[],
    routesReady: <boolean>false,
    tags: <Array<Tags>>[],
    chekedTags: <Array<string>>[],
    filterData: <Array<any>>[],
  }),
  actions: {
    async getData(): Promise<void> {
      try {
        const data = await getData()
        if (data.length !== 0) this.data = data
      } catch {
        console.error('Error while fetching data items:')
      }
    },
    async allTags(): Promise<Array<string>> {
      try {
        return this.data.flatMap((item) => item.tags)
      } catch (error) {
        console.error('Error while fetching all tags:', error)
        return []
      }
    },
    async uniqueTags(): Promise<void> {
      try {
        const tagsStorage = await this.allTags()
        const uniqueTags = Array.from(new Set(tagsStorage))
        this.tags = uniqueTags.map((tag) => ({
          tag: tag,
          active: false,
        }))

        this.chekedTags.forEach((activeTag: string) => {
          const tagIndex = this.tags.findIndex((t) => t.tag === activeTag)
          if (tagIndex !== -1) {
            this.tags[tagIndex].active = true
          }
        })
      } catch (error) {
        console.error('Error while fetching unique tags:', error)
      }
    },
    addTag(tag: string): void {
      const tagIndex = this.tags.findIndex((t) => t.tag === tag)
      if (tagIndex !== -1) {
        const isActive = this.tags[tagIndex].active
        if (isActive) {
          this.chekedTags.push(tag)
        } else {
          const activeTagIndex = this.chekedTags.indexOf(tag)
          if (activeTagIndex !== -1) {
            this.chekedTags.splice(activeTagIndex, 1)
          }
        }
      }
      this.filterData = this.data.filter((item) => {
        return this.chekedTags.every((tag) => item.tags.includes(tag))
      })
    },
    async addSearchItems(query: string): Promise<void> {
      try {
        const queryUpper = query.toUpperCase()
        if (queryUpper === '' && this.filterData.length === 0) {
          this.searchItems = []
        } else {
          this.inputValue = query
          if (this.filterData.length !== 0) {
            this.searchItems = this.filterData.filter((item) =>
              item.title.toUpperCase().includes(queryUpper),
            )
          } else {
            this.searchItems = this.data.filter((item) =>
              item.title.toUpperCase().includes(queryUpper),
            )
          }
          this.searchItems.forEach((item) => {
            item.pageNumber = findPageById(item.id)
          })
        }

        this.currentPage = 1
      } catch {
        console.error('Error while adding search items:')
      }
    },
    async paginatedItems(): Promise<object> {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.searchItems.slice(start, end)
    },
    async totalPages(): Promise<number> {
      return Math.ceil(this.searchItems.length / this.itemsPerPage)
    },
    async fetchTotalPages(): Promise<void> {
      try {
        if (this.searchItems.length === 0) return
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
