import { DeepParsedArguments } from './types';

export function camelizeName(kebab: string): string {
    const pascal = kebab
        .split('-')
        .filter(Boolean)
        .map((word) => word[0].toLocaleUpperCase() + word.substring(1, word.length))
        .join('')

    return pascal[0].toLocaleLowerCase() + pascal.substring(1, pascal.length);
}

export function merge(into: DeepParsedArguments, patch: DeepParsedArguments): void {
    for (const key of Object.keys(patch)) {
        if (key in into) {
            const sourceValue = into[key];
            const patchValue = patch[key];
            const srcIsObject = typeof sourceValue === 'object' && !Array.isArray(sourceValue);
            const patchIsObject = typeof patchValue === 'object' && !Array.isArray(patchValue);
            if (srcIsObject && patchIsObject) {
                merge(sourceValue as DeepParsedArguments, patch[key] as DeepParsedArguments);
            } else {
                into[key] = patchValue;
            }
        }
    }
}
