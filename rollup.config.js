import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
{{if compressTool === 'uglify'}}import { uglify } from 'rollup-plugin-uglify';{{/if}}{{if compressTool === 'minify'}}import minify from 'rollup-plugin-babel-minify';{{/if}}
import { relative } from 'path';
import { browser, module, main, name, version, license, author, homepage } from './package.json';

/**
 * 如果用babel-minify压缩的话, banner字符串的开头和结尾谜之不能换行
 * 不过有一点好的是, 用rollup的banner字段和babel-minify的banner字段都可以
 * uglify的话则需要自己处理下注释
 */
const banner = `/**
 * @Version ${version}
 * @Author: ${author}
 * @Repo: ${homepage}
 * @License: ${license}
 */`;

export default [
	{
		input: 'src/index.js',
		plugins: [
			replace({
				DEBUG: JSON.stringify(false)
			}),
			babel({
				exclude: 'node_modules/**'
			})
		],
		external: ['todo'],
		treeshake: {
			propertyReadSideEffects: false
		},
		output: [
			{
				file: module,
				format: 'esm',
				sourcemap: true
			},
			{
				name,
				file: browser,
				format: 'umd',
				sourcemap: true,
				globals: {
					todo: 'todo'
				}
			}
		]
	},
	{
		input: 'src/index.js',
		plugins: [
			replace({
				DEBUG: JSON.stringify(false)
			}),
			babel({
				exclude: 'node_modules/**'
			}),
			{{if compressTool === 'uglify'}}uglify({
				compress: {
					/* eslint-disable-next-line */
					pure_getters: true
				},
				output: {
					comments: /@Version|@Author|@Repo|@License/i
				}
			}){{/if}}{{if compressTool === 'minify'}}minify({
				comments: false
			}){{/if}}
		],
		external: ['todo'],
		treeshake: {
			propertyReadSideEffects: false
		},
		{{if useForNode}}output: [
			{
				name,
				banner,
				file: 'dist/{{bundleName}}.min.js',
				format: 'umd',
				sourcemap: true,
				// sourcemap生成之后在devtools本来看到的文件是src/index.js, 这个选项可以变成{{bundleName}}.js
				sourcemapPathTransform: path => ~path.indexOf('index') ? '{{bundleName}}.js' : relative('src', path),
				globals: {
					todo: 'todo'
				}
			},
			{
				banner,
				file: main,
				format: 'cjs',
				sourcemap: true
			}
		]{{else}}output: {
			name,
			banner,
			file: 'dist/{{bundleName}}.min.js',
			format: 'umd',
			sourcemap: true,
			// sourcemap生成之后在devtools本来看到的文件是src/index.js, 这个选项可以变成{{bundleName}}.js
			sourcemapPathTransform: path => ~path.indexOf('index') ? '{{bundleName}}.js' : relative('src', path),
			globals: {
				todo: 'todo'
			}
		}{{/if}}
	}
];
