import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('JSON', () => Object)
export class JsonScalar implements CustomScalar<any, any> {
  description = 'JSON custom scalar type'

  parseValue(value: any): any {
    return value
  }

  serialize(value: any): any {
    return value
  }

  parseLiteral(ast: ValueNode): any {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value)
      case Kind.OBJECT:
        return ast.fields.reduce((acc: any, field) => {
          acc[field.name.value] = this.parseLiteral(field.value)
          return acc
        }, {})
      case Kind.LIST:
        return ast.values.map((v) => this.parseLiteral(v))
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value)
      case Kind.BOOLEAN:
        return ast.value
      default:
        return null
    }
  }
}
