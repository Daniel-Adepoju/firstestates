export function removeSearchParams(
  searchParams: URLSearchParams,
  paramsToRemove: string[]
) {
  const params = new URLSearchParams(searchParams)

  paramsToRemove.forEach((param) => {
    params.delete(param)
  })

  return params
}