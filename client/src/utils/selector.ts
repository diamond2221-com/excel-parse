
export function delay(delayTime = 500): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delayTime)
    return
  })
}

export const delayQuerySelector = function (
  self: any,
  selectorStr: string,
  delayTime = 500
): Promise<any[]> {
  return new Promise(resolve => {
    const selector = uni.createSelectorQuery()
    // .in(self.$scope)
    delay(delayTime).then(() => {
      selector
        .select(selectorStr)
        .boundingClientRect()
        .exec((res) => {
          resolve(res)
        })
    })
  })
}
