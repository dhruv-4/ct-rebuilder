import * as vscode from "vscode";

import { readdirSync } from "fs";
import { join } from "path";

const libPath = "js/lib";

let iconPath = "";

export class TestView {
  constructor(context: vscode.ExtensionContext, private workspaceRoot: string) {
    const folders = getDirectories(join(workspaceRoot, libPath));
    console.log(folders);

    iconPath = context.asAbsolutePath(join("resources", "dark", "refresh.svg"));

    const view = vscode.window.createTreeView("testView", {
      treeDataProvider: aNodeWithIdTreeDataProvider(workspaceRoot),
      showCollapseAll: true,
    });

    context.subscriptions.push(view);

    // vscode.commands.registerCommand("testView.reveal", async () => {
    //   const key = await vscode.window.showInputBox({
    //     placeHolder: "Type the label of the item to reveal",
    //   });
    //   if (key) {
    //     await view.reveal(
    //       { key },
    //       { focus: true, select: false, expand: true }
    //     );
    //   }
    // });
    // vscode.commands.registerCommand("testView.changeTitle", async () => {
    //   const title = await vscode.window.showInputBox({
    //     prompt: "Type the new title for the Test View",
    //     placeHolder: view.title,
    //   });
    //   if (title) {
    //     view.title = title;
    //   }
    // });
    vscode.commands.registerCommand("testView.buildLib", async (temp) => {
      console.log("here", temp);
      //   const title = await vscode.window.showInputBox({
      //     prompt: "Type the new title for the Test View",
      //     placeHolder: view.title,
      //   });
      //   if (title) {
      //     view.title = title;
      //   }
    });
  }
}

const tree = {
  a: {
    aa: {
      aaa: {
        aaaa: {
          aaaaa: {
            aaaaaa: {},
          },
        },
      },
    },
    ab: {},
  },
  b: {
    ba: {},
    bb: {},
  },
};
const nodes: any = {};

function aNodeWithIdTreeDataProvider(
  workspaceRoot: string
): vscode.TreeDataProvider<{
  key: string;
}> {
  return {
    getChildren: (element: { key: string }): { key: string }[] => {
      const folders = getDirectories(join(workspaceRoot, libPath));

      return folders.map((folder) => new Key(folder));

      // return folders
      //   return getChildren(element ? element.key : undefined).map((key) =>
      //     getNode(key)
      //   );
    },
    getTreeItem: (element: { key: string }): vscode.TreeItem => {
      const treeItem = getTreeItem(element.key, workspaceRoot);
      treeItem.id = element.key;
      return treeItem;
    },
  };
}

function getChildren(key?: string): string[] {
  if (!key) {
    return Object.keys(tree);
  }
  const treeElement = getTreeElement(key);
  if (treeElement) {
    return Object.keys(treeElement);
  }
  return [];
}

function getTreeItem(key: string, workspaceRoot: string): vscode.TreeItem {
  const treeElement = getTreeElement(key);
  // An example of how to use codicons in a MarkdownString in a tree item tooltip.
  const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);

  const tempIconPath = {
    light: join(__filename, "..", "..", "resources", "light", "dependency.svg"),
    dark: join(__filename, "..", "..", "resources", "dark", "dependency.svg"),
  };
  return {
    label: /**vscode.TreeItemLabel**/ <any>{
      label: `${key}`,
      highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0,
    },
    tooltip,
    contextValue: "folder",
    iconPath: tempIconPath,
    command: {
      command: "testView.buildLib",
      title: "Rebuild",
      arguments: [join(workspaceRoot, libPath, key)],
    },
  };
}

function getTreeElement(element: any): any {
  let parent: any = tree;
  for (let i = 0; i < element.length; i++) {
    parent = parent[element.substring(0, i + 1)];
    if (!parent) {
      return null;
    }
  }
  return parent;
}

function getNode(key: string): { key: string } {
  if (!nodes[key]) {
    nodes[key] = new Key(key);
  }
  return nodes[key];
}

class Key {
  constructor(readonly key: string) {}
}

function getDirectories(source: any) {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}