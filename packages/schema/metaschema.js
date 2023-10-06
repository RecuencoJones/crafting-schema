import { Validator } from 'jsonschema';
import _metaschema from './metaschema.json' assert { type: 'json' };

export const metaschema = _metaschema;

export function validate(schema) {
  return new Validator().validate(schema, metaschema, {
    throwAll: true,
    required: true,
    nestedErrors: true
  });
}
