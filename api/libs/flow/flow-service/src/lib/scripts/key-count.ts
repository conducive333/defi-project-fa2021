export const keyCount = () =>
  `
  pub fun main(address: Address): Int {
    let account = getAccount(address)
    var i = 0
    while true {
      let key = account.keys.get(keyIndex: i)
      if key != nil {
        i = i + 1
      } else {
        break
      }
    }
    return i
  }
`
