# ct-rebuilder

VsCode Extension to rebuild js/lib for ct-backend repo

![ct-rebuilder](https://user-images.githubusercontent.com/75316673/129876357-96bfa49d-78fc-4b6f-aacc-1fb8e7ffa746.gif)

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
