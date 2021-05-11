import { HyphenType, Token, toToken } from './tokenize';
import { ParsedProperty, DeepParsedArguments, DeepParseResult, ParserConfig } from './types';

export function parseArguments(argv: string[], config: ParserConfig): DeepParseResult {
    const parseResults = argv.map((a) => toToken(a, config));
    return foldParsed(parseResults, config);
}

function foldParsed(parsed: Token[], cfg: ParserConfig): DeepParseResult {
    const joined = joinSeparatedNamedArgs(parsed);
    const folder = createParsedFolder(cfg);
    return joined.reduce(folder, []);
}

// join args like ['--name', 'value'] into one name=value
function joinSeparatedNamedArgs(parsed: Token[]): Token[] {
    const joined: Token[] = [];

    for (let i = 0; i < parsed.length - 1; ) {
        const first = parsed[i];
        const second = parsed[i + 1];

        if (
            first.hyphen === HyphenType.Double &&
            !first.value &&
            second.hyphen === HyphenType.None &&
            !second.value
        ) {
            joined.push({
                hyphen: HyphenType.Double,
                name: first.name,
                value: second.name,
            });
            i += 2;
            continue;
        }

        joined.push(first);
        i++;
    }

    return joined;
}

const createParsedFolder = (config: ParserConfig) => (
    acc: DeepParseResult,
    next: Token,
): DeepParseResult => {
    const isPositional = next.hyphen === HyphenType.None && !next.value;

    if (isPositional) {
        acc.push(next.name);
        return acc;
    }

    let named: DeepParsedArguments;
    const last = acc[acc.length - 1];
    if (last && typeof last === 'object') {
        named = last;
    } else {
        named = {};
        acc.push(named);
    }

    let propName: string[];
    if (config.singleHyphenPolicy === 'gcc' && next.hyphen === HyphenType.Single) {
        propName = [next.name[0], next.name.substring(1, next.name.length)];
    } else if (config.allowDots) {
        propName = next.name.split('.');
    } else {
        propName = [next.name];
    }

    setParsedProperty(named, propName, next.value ?? true, config);

    return acc;
};

function setParsedProperty(
    obj: DeepParsedArguments,
    property: string[],
    value: ParsedProperty,
    {sameNamePolicy}: ParserConfig,
): void {
    const stack = property.slice().reverse();
    let parent: DeepParsedArguments = obj;

    while (stack.length > 1) {
        const next = stack.pop() as string;
        const v = obj[next];
        if (typeof v === 'object' && v && !Array.isArray(v)) {
            parent = v;
        } else {
            parent = obj[next] = {};
        }
    }

    const [last] = stack;
    const alreadyExisting = parent[last];
    if (alreadyExisting === undefined) {
        parent[last] = value;
    } else {
        switch (sameNamePolicy) {
            case 'overwrite':
            case undefined:
                parent[last] = value;
                break;

            case 'array':
                if (Array.isArray(alreadyExisting)) {
                    alreadyExisting.push(typeof value === 'string' ? value : '');
                } else {
                    parent[last] = [
                        // TODO: come up with better algorithm (or throw?)
                        typeof alreadyExisting === 'string' ? alreadyExisting : '',
                        typeof value === 'string' ? value : '',
                    ];
                }
                break;

            case 'throw':
                throw new Error(`Duplicated option "${property.join('.')}"`);
        }
    }
}
