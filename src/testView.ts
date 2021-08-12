import * as vscode from "vscode";
import { join } from "path";

import * as Helpers from "./helpers";

const libPath = "js/lib";

export class TestView {
  constructor(context: vscode.ExtensionContext, private workspaceRoot: string) {
    const view = vscode.window.createTreeView("testView", {
      treeDataProvider: aNodeWithIdTreeDataProvider(workspaceRoot),
      showCollapseAll: true,
    });

    context.subscriptions.push(view);

    vscode.commands.registerCommand("testView.buildLib", async (libName) => {
      const folderPath = join(workspaceRoot, libPath, libName);
      try {
        // delete existing dist folder
        let commandLine = "rm -rf dist";
        await Helpers.exec(commandLine, {
          cwd: folderPath,
        });

        // run build command
        commandLine = "yarn build";
        await Helpers.exec(commandLine, {
          cwd: folderPath,
        });

        vscode.window.showInformationMessage(
          `Successfully rebuilt ${join(libPath, libName)}`
        );
      } catch (ex) {
        console.log({ ex });
        vscode.window.showErrorMessage(
          `Failed to run command for ${join(libPath, libName)}`
        );
      }
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
      const folders = Helpers.getDirectories(join(workspaceRoot, libPath));

      return folders.map((folder) => new Key(folder));
    },
    getTreeItem: (element: { key: string }): vscode.TreeItem => {
      const treeItem = getTreeItem(element.key, workspaceRoot);
      treeItem.id = element.key;
      return treeItem;
    },
  };
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
      label: key,
      highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0,
    },
    tooltip,
    contextValue: "folder",
    iconPath: tempIconPath,
    command: {
      command: "testView.buildLib",
      title: "Rebuild",
      arguments: [key],
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

class Key {
  constructor(readonly key: string) {}
}
