const parser = require('./')

describe('index', () => {
  test('parses struct', () => {
    expect(parser('{date=2017-12-11T14:30:00-0700, primitive_null=null, primitive_bool=false, date2=2017-12-11T14:00:00-0700, id=76033946, list=[{string_in_list=accepted, null_in_list=null, id=392440526, email=user.name@7x7.com}, {string_in_list=not_responded, null_in_list=null, id=392440522, email=matt.damon@7x7.com}, {string_in_list=not_responded, null_in_list=null, id=392440525, user_id=165097, email=huh123123@7x7.com}, {string_in_list=accepted, null_in_list=null, id=392440527, email=rahi.sharma@7x7.com}, {string_in_list=not_responded, null_in_list=null, id=392440527, user_id=116927, email=uuhhh.a@7x7.com}, {string_in_list=accepted, null_in_list=null, id=392440523, email=other.name@7x7.com}], email=7x7.qerqwerqewrqwerqwerqw@qwerqwr.qwer.com, string_with_comma=Foo:bar bar, baz bazmeh, creator=joe.fragrant@7x7.com}')).toMatchSnapshot()
  })

  test('parses struct with whitespace', () => {
    expect(parser('{key=value,    some=email@some.com,     someStruct={a=b}    }')).toMatchSnapshot()
  })

  test('parses given list of boolean primitives', () => {
    expect(parser('[false, true, false, true]')).toMatchSnapshot()
  })

  test('parses given list with nulls', () => {
    expect(parser('[something, bar, baz, null, meh]')).toMatchSnapshot()
  })

  test('parses nested arrays', () => {
    expect(parser('[[a, b], [v, b]]')).toMatchSnapshot()
  })
})
