import { ParserConfig } from './types';
import { camelizeName } from './utils';

export enum HyphenType {
    None,
    Single,
    Double,
}

export interface Token {
    hyphen: HyphenType;
    name: string;
    value?: string;
}

export function toToken(arg: string, { camelize }: ParserConfig): Token {
    let type = HyphenType.None;
    let name = arg;
    let value: string | undefined;

    if (arg.startsWith('--')) {
        type = HyphenType.Double;
        name = arg.substring(2, arg.length);
    } else if (arg[0] === '-') {
        type = HyphenType.Single;
        name = arg.substring(1, arg.length);
    }

    const index = name.indexOf('=');

    if (index !== -1) {
        value = name.substring(index + 1, name.length);
        name = name.substring(0, index);
    }

    if (camelize && name.length > 1) {
        name = camelizeName(name);
    }

    return { hyphen: type, name, value };
}
