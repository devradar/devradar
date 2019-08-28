export const sortFunctionCurry = (sortBy, inverted = false) => {
  return (a, b) => {
    // TODO: use toLowerCase() in case argument is a string for case-insensitive sort
    if (a[sortBy] < b[sortBy]) {
      return inverted ? -1 : 1
    } else {
      return inverted ? 1 : -1
    }
  }
}
