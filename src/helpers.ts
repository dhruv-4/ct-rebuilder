import * as vscode from "vscode";
import { readdirSync } from "fs";

import * as cp from "child_process";

export function getDirectories(source: any) {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function exec(
  command: string,
  options: cp.ExecOptions
): Promise<{ stdout: string; stderr: string }> {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
}

const TYPESCRIPT_EXTENSION_ID = "vscode.typescript-language-features";

export async function softRestartTsServer() {
  const typeScriptExtension = vscode.extensions.getExtension(
    TYPESCRIPT_EXTENSION_ID
  );
  if (!typeScriptExtension || typeScriptExtension.isActive === false) {
    vscode.window.showErrorMessage(
      "TypeScript extension is not active or not running."
    );
    return;
  }

  await vscode.commands.executeCommand("typescript.restartTsServer");
}
