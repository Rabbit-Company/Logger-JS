import dts from "bun-plugin-dts";
import fs from "fs/promises";
import { Logger } from "./src";

await fs.rm("./module", { recursive: true, force: true });
await fs.rm("./dist", { recursive: true, force: true });

const logger = new Logger();

logger.info("Start bulding module...");
let moduleBuild = await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./module",
	target: "node",
	format: "esm",
	plugins: [dts({ output: { noBanner: true } })],
});

if (moduleBuild.success) {
	await fs.rename("./module/index.js", "./module/logger.js");
	await fs.rename("./module/index.d.ts", "./module/logger.d.ts");
	logger.info("Bulding module complete");
} else {
	logger.error("Bulding module failed");
}
