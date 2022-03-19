import { Command } from 'commander';
import buildBookmark from './cli/buildBookmark.js';
import compileBookmark from './cli/compileBookmark.js';

const program = new Command();

program
.command('buildBookmark')
.description('Builds the bookmark script')
.argument('[output]', 'Output directory', './')
.option('--d, --development', 'If the result shouldn\'t be optimized for production')
.option('--w, --watch', 'If the source should be watched for updates')
.action(buildBookmark)
;

program
.command('compileBookmark')
.description('Compiles the bookmark source')
.option('--d, --development', 'If the result shouldn\'t be optimized for production')
.action(compileBookmark)
;

program.parse(process.argv);