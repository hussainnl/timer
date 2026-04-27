import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const uiPath = path.join(root, "src/js/ui-helpers.js");
const controllerPath = path.join(root, "src/js/session-controller.js");
const appPath = path.join(root, "src/js/app.js");
const outputPath = path.join(root, "script.js");

function stripModuleSyntax(source) {
    return source
        .replace(/^export\s+/gm, "")
        .replace(/^import\s+.+?;$/gm, "")
        .trim();
}

const [uiSource, controllerSource, appSource] = await Promise.all([
    readFile(uiPath, "utf8"),
    readFile(controllerPath, "utf8"),
    readFile(appPath, "utf8"),
]);

const bundledSource = [
    "// Generated from src/js/*.js by build-js.mjs",
    stripModuleSyntax(uiSource),
    "",
    stripModuleSyntax(controllerSource),
    "",
    stripModuleSyntax(appSource),
    "",
].join("\n");

await writeFile(outputPath, bundledSource, "utf8");
