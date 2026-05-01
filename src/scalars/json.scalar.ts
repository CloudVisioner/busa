import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('JSON', () => Object)
export class JsonScalar implements CustomScalar<unknown, unknown> {
  description = 'JSON custom scalar type';

  parseValue(value: unknown): unknown {
    return value;
  }

  serialize(value: unknown): unknown {
    return value;
  }

  parseLiteral(ast: ValueNode): unknown {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        return ast.fields.reduce<Record<string, unknown>>((acc, field) => {
          acc[field.name.value] = this.parseLiteral(field.value);
          return acc;
        }, {});
      case Kind.LIST:
        return ast.values.map((valueNode) => this.parseLiteral(valueNode));
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.BOOLEAN:
        return ast.value;
      default:
        return null;
    }
  }
}
