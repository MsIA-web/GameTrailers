const mainOptions = {
  width: '100%',
  height: '100%',
  type: 'fade',
  rewind: true,
  pagination: false,
  arrows: false,
  drag: false,
}
const mainOptionsForTrailers = {
  width: '100%',
  height: '100%',
  fixedHeight: '39.35vw',
  type: 'fade',
  rewind: true,
  pagination: false,
  arrows: false,
  drag: false,
}
const thumbnailsOptions = {
  fixedWidth: '20vw',
  fixedHeight: '100%',
  gap: 10,
  rewind: true,
  pagination: false,
  isNavigation: true,
  focus: 'center' as const,
  breakpoints: {
    768: {
      arrows: false,
    },
    480: {
      fixedWidth: '30vw',
    },
  },
}

export { mainOptions, mainOptionsForTrailers, thumbnailsOptions }
