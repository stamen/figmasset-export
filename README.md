## Figmasset-export

Simplifies exporting a number of assets from Figma to disk.

One use case for this is when a project that uses FigmassetJS, leaves the iterative design phase and moves into production. You can simply export all assets into a static image directory, and replace the FigmassetJS code with the snippet given below.

### Usage

```
index.js --file <filekey> --frame <node ID or name> --out myassets [more
options]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --file     File key                                        [string] [required]
  --frame    Node id or name of frame containing assets       [array] [required]
  --token    Figma personal access token (or set FIGMA_TOKEN)           [string]
  --out      Directory to write outputs             [string] [default: "assets"]
  --scale    Scales at which to export: 2 for @2x       [array] [default: [1,2]]

Examples:
  index.js --file BESGFwgYIJRhho324d26tnHd26t --frame 3:5 --frame pins --scale
  1 2 --out public/pins
```

The `--frame` option can reference either the node ID ("3:5", found in the URL) of the frame, or its name (found in the Layers sidebar).



### Guide

In Figma, arrange your assets as top-level children under one or more frames. That is, your Layers sidebar should look something like this:

```
# myframe
  # mycircle
  # myrectangle
# myotherframe
  # myexclamation
    - dot
    - straight bit
# other frame I don't care about
  # junk
```

(The top-level children under each frame don't have to themselves be frames - they can be any type.)

Get the file key from the URL. Given a URL like https://www.figma.com/file/ABC123/Untitled?node-id=0%3A1, "ABC123" is your file key.

In this scenario, you can export your assets like this:

`figmasset-export --file ABC123 --frame myframe myotherframe --scale 1 2 --out assets`

This will produce these files:

```
assets@1x/
  assets.json
  mycircle.png
  myrectangle.png
  myexclamation.png
assets@2x/
  assets.json
  mycircle.png
  myrectangle.png
  myexclamation.png
```

### Load assets as icons into Mapbox GL JS or Maplibre GL JS

You can use the generated `assets.json` files to load the assets as icons into a Map* GL JS map, as follows:

```js
async function loadAssets(map) {
    const assets = (await fetch('myicons/assets.json').then(r => r.json)).data;
    for (const asset of assets) {
        map.loadImage(`myicons/${asset.fileName}`, (error, image) => {
            this.map.addImage(asset.id, image, { pixelRatio: asset.scale })
        });
    }
}
```


### Generate a Mapbox GL or Maplibre GL spritesheet

It is easy to combine figmasset-export with [mbsprite](https://www.npmjs.com/package/mbsprite) to turn a set of icons into a spritesheet:

```
figmasset-export --file ABC123 --frame myframe myotherframe --frame pins --scale 1 2 --out assets
npx mbsprite bundle sprite assets@1x assets@2x
```
