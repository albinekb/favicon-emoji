# :palm_tree: favicon-emoji [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Generate an awesome emoji-favicon

example at: [deseat.me](https://deseat.me/)

## Install

### yarn

```sh
yarn global add favicon-emoji
```

### npm

```sh
npm install --global favicon-emoji
```

## Usage

### Generate favicon

```sh
favicon-emoji --emoji ✨

> ✨ Done, emoji favicon saved to ./favicon.ico
```

### Help

```sh
favicon-emoji --help

> 🌴 favicon-emoji

  Usage:
    favicon-emoji [options]

  Options:
    -d, --destination <value>  favicon destination     [default: "./favicon.ico"]
    -e, --emoji <value>        choose emoji            [default: "✨"]
    -m, --minimum              create favicon with selected sizes (16x16, 32x32, 48x48)
    -h, --help                 Output usage information
    -l, --list                 show list of available emojis
    -p, --png <value>          png output path         [default: "./favicon.png"]
    -v, --version              Output the version number
```
