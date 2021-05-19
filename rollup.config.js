import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",
  output: {
    dir: "lib",
    name: "index",
    format: "cjs",
  },
  plugins: [typescript()],
};
