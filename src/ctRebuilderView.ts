import * as vscode from "vscode";
import { join } from "path";

import * as Helpers from "./helpers";

const libPath = "js/lib";

export class CtRebuilderView {
  constructor(context: vscode.ExtensionContext, private workspaceRoot: string) {
    const view = vscode.window.createTreeView("testView", {
      treeDataProvider: aNodeWithIdTreeDataProvider(this.workspaceRoot),
      showCollapseAll: true,
    });

    context.subscriptions.push(view);

    vscode.commands.registerCommand("testView.buildLib", async (libName) => {
      const folderPath = join(this.workspaceRoot, libPath, libName);
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
      const treeItem = getTreeItem(element.key);
      treeItem.id = element.key;
      return treeItem;
    },
  };
}

function getTreeItem(key: string): vscode.TreeItem {
  const tooltip = new vscode.MarkdownString(
    `$(zap) Click to rebuild ${key}`,
    true
  );

  return {
    label: {
      label: key,
      highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0,
    },
    tooltip,
    contextValue: "folder",
    command: {
      command: "testView.buildLib",
      title: "Rebuild",
      arguments: [key],
    },
  };
}

class Key {
  constructor(readonly key: string) {}
}
