import dts from 'bun-plugin-dts';
import Logger from '@rabbit-company/logger';
import fs from 'fs/promises';

await fs.rm('./module', {recursive: true, force: true});
await fs.rm('./browser', {recursive: true, force: true});
await fs.rm('./dist', {recursive: true, force: true});

Logger.info('Start bulding module...');
let moduleBuild = await Bun.build({
  entrypoints: ['./src/logger.ts'],
  outdir: './module',
	target: 'node',
	format: 'esm',
  plugins: [
    dts({output: {noBanner: true}})
  ],
});

if(moduleBuild.success){
	Logger.info('Bulding module complete');
}else{
	Logger.error('Bulding module failed');
}

Logger.info('Start bulding browser...');
let browserBuild = await Bun.build({
  entrypoints: ['./src/logger.ts'],
  outdir: './browser',
	target: 'browser',
	format: 'esm',
  plugins: [
    dts({output: {noBanner: true}})
  ],
});

if(browserBuild.success){
	Logger.info('Bulding browser complete');
}else{
	Logger.error('Bulding browser failed');
}

fs.cp('./src/index.html', './dist/index.html', {recursive: true, force: true});

Logger.info('Start bundling dist...');
let distBuild = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
	target: 'browser',
	format: 'esm',
	minify: true,
	sourcemap: 'none', // Bun still generates incorrect sourcemaps
  plugins: [],
});

if(distBuild.success){
	Logger.info('Bundling dist complete');
}else{
	Logger.error('Bundling dist failed');
	Logger.error(distBuild.logs);
}