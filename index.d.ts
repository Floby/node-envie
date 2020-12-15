declare type Value = string | boolean | number | null | undefined | Date
declare interface FlatObject {
  [key: string]: Value
}
declare interface EnvieMap {
  get (key: string): Value
  has (key: string): boolean
  values (): FlatObject
  validate (): void
  helpString (): string
  displayHelp (target?: any): void
}
export function Envie (schema: any, source?: any): EnvieMap
export const Joi: any
export default Envie
