#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const exportAssets = require('./exportAssets');
const argv = yargs(hideBin(process.argv))
    .usage(
        '$0 --file <filekey> --frame <node ID or name> --out myassets [more options]'
    )
    .option('file', {
        type: 'string',
        description: 'File key',
    })
    .option('frame', {
        type: 'string',
        // TODO: treat ID or frame name interchangeably
        description: 'Node id or name of frame containing assets',
        array: true,
    })
    .option('token', {
        type: 'string',
        description: 'Figma personal access token (or set FIGMA_TOKEN)',
        default: process.env.FIGMA_TOKEN,
    })
    .option('out', {
        type: 'string',
        description: 'Directory to write outputs',
        default: 'assets',
    })
    .option('scale', {
        type: 'string',
        default: [1, 2],
        description: 'Scales at which to export: 2 for @2x',
        array: true,
    })
    .demandOption(
        ['frame', 'file'],
        'You need to specify the file and the specific frame[s] that contain your assets.'
    )
    .strictOptions()
    .strictCommands()
    .array('frame')
    .example([
        [
            '$0 --file BESGFwgYIJRhho324d26tnHd26t --frame 3:5 --frame pins --scale 1 2 --out public/pins',
        ],
    ]).argv;
argv.scale = argv.scale.flatMap((scale) => String(scale).split(/[, ]+/));
argv.frame = argv.frame.flatMap((frame) => String(frame).split(/[, ]+/));
// console.log(argv);
exportAssets(argv);
