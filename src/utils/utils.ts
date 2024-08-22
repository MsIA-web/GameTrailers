const findPageById = (id: number): number => {
  const itemsPerPage = 5
  const currentPage = Math.ceil(id / itemsPerPage)
  return currentPage
}
const encodedTitle = (props: any) =>
  props.title !== undefined ? encodeURIComponent(props.title) : ''

export { findPageById, encodedTitle }
