export default () => {
  $('.block-name').each(function () {
    const block = {}

    block.self = this
    block.$self = $(block.self)

    block.$self.on('click', () => {
      // do something
    })
  })
}
