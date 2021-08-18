# ct-rebuilder

VsCode Extension to rebuild `js/lib` for `ct-backend` repo

![ct-rebuilder](https://user-images.githubusercontent.com/75316673/129899777-158ec7f7-080d-4165-b7d4-da6d9f162e08.gif)

## Installation

1. Install vsce to package extension

```sh
npm install -g vsce
```

2. Clone repo and build extension(This will create `ct-rebuilder-0.0.1.vsix` in the repo root)

```sh
vsce package
```

3. Install extension

```sh
code --install-extension ct-rebuilder-0.0.1.vsix
```

**Enjoy!**
