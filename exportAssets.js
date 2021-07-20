const { getFigmaIconsByFrames } = require('figmasset');
const fetch = require('node-fetch');
const Downloader = require('nodejs-file-downloader');
const fs = require('fs');

async function download({ figmaOptions, downloadDir }) {
    const results = await getFigmaIconsByFrames(figmaOptions);
    const assetsByScale = figmaOptions.scales.reduce(
        (byScale, scale) => ({ ...byScale, [scale]: [] }),
        {}
    );
    await Promise.all(
        Object.keys(results).flatMap((assetKey) => {
            const asset = results[assetKey];
            return figmaOptions.scales.map((scale) => {
                assetsByScale[scale].push({
                    id: assetKey,
                    fileName: `${assetKey}.${figmaOptions.format}`,
                    scale,
                    // TODO width/height etc
                });
                return new Downloader({
                    url: asset[`@${scale}x`],
                    directory: downloadDir + `@${scale}x`,
                    fileName: `${assetKey}.${figmaOptions.format}`,
                    cloneFiles: false,
                }).download();
            });
        })
    );
    for (const scale of figmaOptions.scales) {
        fs.writeFileSync(
            downloadDir + `@${scale}x/assets.json`,
            JSON.stringify(assetsByScale[scale], null, 2)
        );
    }
    return results;
}
async function runExport(argv) {
    const options = {
        figmaOptions: {
            fetchFunc: fetch,
            personalAccessToken: argv.token,
            fileKey: argv.file,
            scales: argv.scale,
            frameIds: argv.frame.filter((id) => id.match(/^\d+:\d+$/)),
            frameNames: argv.frame.filter((id) => !id.match(/^\d+:\d+$/)),
            format: argv.format,
        },
        downloadDir: argv.out,
    };
    const results = await download(options);
    console.log(results);
    console.log('Done!');
}

module.exports = runExport;
