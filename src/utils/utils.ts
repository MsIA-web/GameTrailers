const findPageById = (id: number): number => {
  const itemsPerPage = 5
  const currentPage = Math.ceil(id / itemsPerPage)
  return currentPage
}
const encodedTitle = (props: any) =>
  props.title !== undefined ? encodeURIComponent(props.title) : ''

function filterByWordStart(items: any[], searchQuery: string): any[] {
  return items.filter((item: any) => {
    const words = item.title.split(' ')
    return words.some((word: string) =>
      word.toLowerCase().startsWith(searchQuery.toLowerCase()),
    )
  })
}

export { findPageById, encodedTitle, filterByWordStart }
