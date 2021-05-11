import * as path from 'path';
import * as fs from 'fs';

function load(what: string) {
    const fullpath = path.resolve(process.cwd(), what);
    const content = fs.readFileSync(fullpath, {encoding: 'utf-8'});
    return JSON.parse(content);
}

const [,, sourcePath, templatePath] = process.argv;
const source = load(sourcePath);
const template = load(templatePath);
console.log(JSON.stringify({...source, ...template}, null, 2));
