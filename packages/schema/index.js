import yaml from 'js-yaml';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { validate } from './metaschema.js';

export function load(schema) {
  return yaml.load(schema);
}

export async function parse(schema) {
  try {
    let value = load(schema);

    if (!value) {
      return {};
    }

    value = await $RefParser.dereference(value);

    validate(value);

    return value;
  } catch(err) {
    let message = err.message;

    if (err.errors) {
      message = [
        'Schema is not valid:',
        ...err.errors.map((error) => `- ${ error.stack }`)
      ].join('\n');
    }

    throw new Error(message);
  }
}
