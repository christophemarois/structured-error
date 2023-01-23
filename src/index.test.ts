import { test, expect } from 'vitest'
import { createStructuredError } from '.'

function getTest() {
  return createStructuredError('FormError', {
    invalidEmail(email: string) {
      return `Email ${email} is invalid`
    },
    invalidPasswordConfirm({ a, b }: { a: string; b: string }) {
      return `Password ${a} and confirm ${b} are different`
    },
  })
}

test('static codes are correct', () => {
  const FormError = getTest()
  expect(FormError.codes).toStrictEqual([
    'invalidEmail',
    'invalidPasswordConfirm',
  ])
})

test('instanciates correctly with constructor', () => {
  const FormError = getTest()
  expect(() => new FormError('invalidEmail', 'a@a')).not.toThrow()
})

test('instanciates correctly with shortcut', () => {
  const FormError = getTest()
  expect(() => FormError.invalidEmail('a@a')).not.toThrow()
})

test('instance extends Error', () => {
  const FormError = getTest()
  expect(new FormError('invalidEmail', 'a@a')).toBeInstanceOf(Error)
})

test('is has the correct properties', () => {
  const FormError = getTest()

  const email = 'a@a'
  const { message, code, data } = FormError.invalidEmail(email)

  expect({ message, code, data }).toStrictEqual({
    message: `Email ${email} is invalid`,
    code: 'invalidEmail',
    data: email,
  })
})
