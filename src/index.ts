export function createStructuredError<
  CodeDict extends Record<any, (data: any) => string>,
>(name: string, codeDict: CodeDict) {
  const StructuredError = class StructuredError<
    Code extends keyof CodeDict,
    Data extends Parameters<CodeDict[Code]>[0],
  > extends Error {
    constructor(public code: Code, public data: Data, options?: ErrorOptions) {
      super(codeDict[code]!(data), options)
      Object.setPrototypeOf(this, StructuredError.prototype)

      // Will appear in the stack trace. Defined this way because typescript
      // doesn't let us overwrite it as a setter
      Object.defineProperty(this.constructor, 'name', { value: name })
    }

    /** An array containing the possible codes for this structured error */
    static codes: Array<keyof CodeDict> = Object.keys(codeDict)
  }

  // TS doesn't support dynamic static props, so we have to do the work ourselves
  // we begin by specifying explicitely the type signatures of the properties
  // we're going to add
  type DynamicStaticProps = {
    [Code in keyof CodeDict]: (
      data: Parameters<CodeDict[Code]>[0],
      options?: ErrorOptions,
    ) => InstanceType<
      typeof StructuredError<Code, Parameters<CodeDict[Code]>[0]>
    >
  }

  // Then we patch them directly on the class constructor
  for (const code of StructuredError.codes) {
    const instanciator = (data: unknown, options?: ErrorOptions) =>
      new StructuredError(code, data, options)
    Object.defineProperty(StructuredError, code, { value: instanciator })
  }

  // Finally, we return the class with a synthetic type obtained from the
  // union of the real class and the patched dynamic static props
  return StructuredError as typeof StructuredError & DynamicStaticProps
}

export default createStructuredError
