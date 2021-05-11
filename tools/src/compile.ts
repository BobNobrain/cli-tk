import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';

function findAllTsFiles(root: string, result: string[] = []) {
    const entries = fs.readdirSync(root, {withFileTypes: true});
    for (const entry of entries) {
        if (entry.isDirectory()) {
            findAllTsFiles(path.resolve(root, entry.name), result);
            continue;
        }

        if (entry.isFile() && entry.name.endsWith('.ts')) {
            result.push(path.resolve(root, entry.name));
        }
    }

    return result;
}

const [,, packageName] = process.argv;
const packageDir = path.resolve(process.cwd(), 'packages', packageName);

const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'tsconfig.json'), {encoding: 'utf8'}));
const allSourceFiles = findAllTsFiles(path.resolve(packageDir, 'src'));
const program = ts.createProgram(allSourceFiles, {
    ...config.compilerOptions,
    outDir: path.resolve(packageDir, 'dist'),
});

let diagnostics = ts.getPreEmitDiagnostics(program);
let exitCode = 0;

const emitResult = program.emit();

if (emitResult.emitSkipped) {
    diagnostics = diagnostics.concat(emitResult.diagnostics);
    exitCode = 1;
}

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};

if (diagnostics.length) {
    const msg = ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost);
    console[exitCode === 0 ? 'log' : 'error'](msg);
}

process.exit(exitCode);
