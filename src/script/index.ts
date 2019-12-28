import { Ttest } from './_test'

const obj: Ttest = {
  one: 'example'
}

const test: (t: string) => string = (t: string) => {
  return t
}

console.log(test('top'))
console.log(test(process.env.NODE_ENV))
console.log(obj.one)
