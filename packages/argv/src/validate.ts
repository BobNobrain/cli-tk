// import { ParsedProperty } from './types';

interface ArgumentDescriptionBase {
    type: 'boolean' | 'number' | 'string';
    isArray?: boolean;
    default?: string | number | boolean | string[] | number[] | boolean[];
    aliases?: string[];
}

interface BooleanArgumentDescription extends ArgumentDescriptionBase {
    type: 'boolean';
    isArray?: false;
    default?: boolean;
    negatedAliases?: string[];
}
interface NumberArgumentDescription extends ArgumentDescriptionBase {
    type: 'number';
    isArray?: false;
    default?: number;
}
interface StringArgumentDescription extends ArgumentDescriptionBase {
    type: 'string';
    isArray?: false;
    default?: string;
}
interface BooleanArrayArgumentDescription extends ArgumentDescriptionBase {
    type: 'boolean';
    isArray: true;
    default?: boolean[];
}
interface NumberArrayArgumentDescription extends ArgumentDescriptionBase {
    type: 'number';
    isArray: true;
    default?: number[];
}
interface StringArrayArgumentDescription extends ArgumentDescriptionBase {
    type: 'string';
    isArray?: false;
    default?: string;
}

export type ArgumentDescription =
    | BooleanArgumentDescription
    | NumberArgumentDescription
    | StringArgumentDescription
    | BooleanArrayArgumentDescription
    | NumberArrayArgumentDescription
    | StringArrayArgumentDescription;

export type BuildParseResult<T extends Record<string, ArgumentDescription>> = {
    [key in keyof T]: BuildParsedProp<T[key]>;
};
type BuildParsedProp<T extends ArgumentDescription> =
    | (T extends { type: 'number'; isArray?: false } ? number : never)
    | (T extends { type: 'number'; isArray: true } ? number[] : never)
    | (T extends { type: 'boolean'; isArray?: false } ? boolean : never)
    | (T extends { type: 'boolean'; isArray: true } ? boolean[] : never)
    | (T extends { type: 'string'; isArray?: false } ? string : never)
    | (T extends { type: 'string'; isArray: true } ? string[] : never);

