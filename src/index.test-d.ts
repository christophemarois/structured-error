// https://github.com/SamVerschueren/tsd
import { expectType, expectError } from 'tsd'
import { createStructuredError } from '.'

const FormError = createStructuredError('FormError', {
  invalidEmail(email: string) {
    return `Email ${email} is invalid`
  },
  invalidPasswordConfirm({ a, b }: { a: string; b: string }) {
    return `Password ${a} and confirm ${b} are different`
  },
})

// Test that static codes is an array of literals
expectType<('invalidEmail' | 'invalidPasswordConfirm')[]>(FormError.codes)

// Test that shortcuts and manual instances have the same resulting instance type
expectType<InstanceType<typeof FormError<'invalidEmail', string>>>(
  FormError.invalidEmail('a@a.a'),
)

// Test that a wrong data argument type is an error
expectError(FormError.invalidPasswordConfirm(1))
