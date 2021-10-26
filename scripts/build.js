/**
 * Build WorkFrame project.
 *
 * There are two stages:
 *
 * 1. Type checking with tsc
 * 2. Compiling/bundling with esbuild
 *
 * Step 1 is necessary because esbuild doesn't do type checking although
 * it does compile TypeScript to JavaScript.
 */
const proc = require("child_process");
const esbuild = require("esbuild");
const dotenv = require("dotenv");

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const ENV = process.env.NODE_ENV;
const IS_DEV = ENV === "dev";
const WATCH = process.argv.includes("--watch");

/**
 * Plugin to load entries from .env file.
 *
 * All entries starting with WORKFRAME_ are then importable like so:
 *
 *   import { WORKFRAME_XYZ } from "env";
 */
const dotenvPlugin = {
  name: "dotenv",

  setup(build) {
    dotenv.config();

    build.onResolve({ filter: /^env$/ }, (args) => ({
      path: args.path,
      namespace: "env-ns",
    }));

    build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => {
      const entries = {};

      Object.keys(process.env)
        .filter((name) => name.startsWith("WORKFRAME_"))
        .forEach((name) => (entries[name] = process.env[name]));

      return {
        contents: JSON.stringify(entries),
        loader: "json",
      };
    });
  },
};

const typeCheckPlugin = {
  name: "typecheck",
  setup(build) {
    build.onStart(async () => {
      const tsc = proc.spawn("tsc", ["--noEmit", "--pretty"]);
      tsc.stdout.on("data", (data) => process.stdout.write(data));
      tsc.stderr.on("data", (data) => process.stderr.write(data));
    });
  },
};

/** Plugin to inject JSX-related imports into .jsx & .tsx files.
 *
 * Injects the following import at the top of all .jsx & .tsx files:
 *
 #     import { createVnodeFromJsxNode, jsxFragment } from "workframe";
 *
 * The use of preact to process JSX is an implementation detail and
 * having to add that import to every JSX file would be tedious.
 */
const jsxPlugin = {
  name: "jsx",

  setup(build) {
    const fs = require("fs");
    const path = require("path");

    build.onLoad({ filter: /.*\.[jt]sx/ }, (args) => {
      const ext = path.extname(args.path).slice(1);
      let contents = fs.readFileSync(args.path, { encoding: "utf8" });
      contents = [
        "// The following line was added by esbuild",
        'import { createVnodeFromJsxNode, jsxFragment } from "workframe";',
        contents,
      ];
      return { contents: contents.join("\n"), loader: ext };
    });
  },
};

esbuild.build({
  entryPoints: ["./src/main"],
  outfile: "public/build/bundle.js",
  target: "es2015",
  platform: "browser",
  bundle: true,
  minify: !IS_DEV,
  sourcemap: IS_DEV,
  watch: WATCH,
  logLevel: "info",
  plugins: [dotenvPlugin, typeCheckPlugin, jsxPlugin],
});
