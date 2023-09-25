import path from "path";
import { fileURLToPath } from "url";
import { UserscriptPlugin } from "webpack-userscript";
import MergeIntoSingleFilePlugin from "webpack-merge-and-include-globally";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);

export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(path.dirname(__filename), "dist"),
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: "GGn Guess the Number Game",
        namespace: "http://greasyfork.org/",
        version: "2.0",
        description: "Assist with hosting a guess the number game",
        author: "drlivog, blackfireweb",
        match:
          "https://gazellegames.net/forums.php?*action=viewthread*&threadid=28282*",
        icon: "https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net",
        grant: ["GM_getValue", "GM_setValue", "GM_deleteValue"],
        license: "MIT",
      },
    }),
    new MergeIntoSingleFilePlugin({
      files: {
        "main.js": [
          "src/options.js",
          "src/utils.js",
          "src/ruleFunctions.js",
          "src/rules.js",
          "src/collapseRules.js",
          "src/process.js",
          "src/index.js",
        ],
      },
      transform: {
        "main.js": (code) => {
          return code
            .replaceAll(/import[\s\S]+?;/gm, "")
            .replaceAll(/export /g, "");
        },
      },
    }),
  ],
  mode: "development",
};
