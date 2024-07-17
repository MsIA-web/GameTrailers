import { defineStore } from 'pinia'
import {
  getPageData,
  getTotalItemsCount,
  getTotalPageCount,
} from '../services/EventServices'

interface TrailersPreview {
  url: string
}

interface CurrentItem {
  id: number
  title: string
  imgLandUrl: string
  releaseDate: string
  developer: string
  publisher: string
  tags: string | Array<any>
  img1Url: string
  img2Url: string
  img3Url: string
  img4Url: string
  img5Url: string
  trailerUrl: string
  trailerPreview: TrailersPreview
  gameLink: string
  steamIcon: string
}
interface MyStoreState {
  page: Array<any>
  TotalItemsCount: number | null
  currentPage: number | null
  totalPages: number | null
  pagesArray: Array<number>
  currentItem: CurrentItem
}

interface MyStoreActions {
  getCurrentPage(): void
  fetchTotalPages(): Promise<void>
  fetchPageData(): Promise<void>
  initialize(): Promise<void>
  getElementById(id: number): void
  parseTags(): void
  GetAndConvertItemTags(): void
}

export const usePageStore = defineStore<'page', MyStoreState>({
  id: 'page',
  state: (): MyStoreState => ({
    page: <Array<any>>[],
    TotalItemsCount: null,
    currentPage: null,
    totalPages: null,
    pagesArray: [],
    currentItem: {} as CurrentItem,
  }),
  actions: {
    getCurrentPage(): void {
      const url = window.location.pathname
      const regex = /(\d+)$/
      const match = url.match(regex)
      if (match && match[1]) {
        this.currentPage = parseInt(match[1], 10)
      } else {
        console.log('Current page not found')
      }
    },
    async fetchTotalPages(this: MyStoreState & MyStoreActions) {
      try {
        this.totalPages = await getTotalPageCount()
        if (this.totalPages !== null) {
          this.pagesArray = Array.from(
            { length: this.totalPages },
            (_, k) => k + 1,
          )
        }
      } catch (error) {
        console.error('Error while fetching total pages:', error)
      }
    },
    async fetchPageData(this: MyStoreState & MyStoreActions) {
      try {
        if (this.currentPage !== null)
          this.page = await getPageData(this.currentPage)
      } catch (error) {
        console.error('Error while fetching data:', error)
      }
    },
    async initialize(this: MyStoreState & MyStoreActions) {
      try {
        await getTotalItemsCount()
        this.getCurrentPage()
        await this.fetchTotalPages()
        await this.fetchPageData()
      } catch (error) {
        console.error('Error while initializing:', error)
      }
    },
    getElementById(this: MyStoreState & MyStoreActions, id: number): void {
      const item = this.page.find((item) => item.id === id)
      if (item) {
        this.currentItem = item
      } else {
        console.log(`Item with id ${id} not found`)
      }
    },
  },
  persist: true,
})
