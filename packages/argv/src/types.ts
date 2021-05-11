export type ParsedProperty = true | string | string[];

export type FlatParsedArguments = {
    [key in string]: ParsedProperty;
};

export type DeepParsedArguments = {
    [key in string]: ParsedProperty | DeepParsedArguments;
};

export type FlatParseResult = (string | FlatParsedArguments)[];
export type DeepParseResult = (string | DeepParsedArguments)[];

export type SingleHypenPolicy = 'throw' | 'set' | 'double' | 'gcc';
export type SameNamePolicy = 'overwrite' | 'array' | 'throw';

export interface ParserConfig {
    camelize?: boolean;
    singleHyphenPolicy?: SingleHypenPolicy;
    sameNamePolicy?: SameNamePolicy;
    allowDots?: boolean;
}
