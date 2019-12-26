import { Ttest } from './_test'

const obj: Ttest = {
  one: 'うんこ'
}

const test: (t: string) => string = (t: string) => {
  return t
}

console.log(test('top'))
console.log(test(process.env.NODE_ENV))
console.log(obj.one)
