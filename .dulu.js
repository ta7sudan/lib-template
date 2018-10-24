'use strict';

module.exports = function (projectName) {
	return {
		prompts: [
			{
				name: 'project',
				type: 'input',
				message: 'Project Name',
				default: projectName
			},
			{
				name: 'author',
				type: 'input',
				message: 'Author',
				validate(input) {
					return !!input;
				}
			},
			{
				name: 'desc',
				type: 'input',
				message: 'Project description',
				default: 'A rollup library project'
			},
			{
				name: 'keywords',
				type: 'input',
				message: 'Keywords',
				default: 'rollup'
			},
			{
				name: 'bundleName',
				type: 'input',
				message: 'Bundle name',
				default: projectName
			},
			{
				name: 'hasTest',
				type: 'confirm',
				message: 'Set up unit tests?',
				default: true
			},
			{
				name: 'hasPuppeteer',
				when: 'hasTest',
				type: 'confirm',
				message: 'Use puppeteer for tests?',
				default: false
			},
			{
				name: 'hasPock',
				type: 'confirm',
				message: 'Use pock for dev and tests?',
				default: true
			},
			{
				name: 'hasTravis',
				type: 'confirm',
				message: 'Use travis-ci?',
				default: true
			},
			{
				name: 'email',
				when: 'hasTravis',
				type: 'input',
				message: 'Email',
				validate(input) {
					return !!input;
				}
			},
			{
				name: 'compressTool',
				type: 'list',
				message: 'Which compress tool do you need?',
				choices: [{
					name: 'babel-minify',
					value: 'minify'
				}, {
					name: 'uglify',
					value: 'uglify'
				}]
			}
		],
		complete(answers) {
			const { hasTest, hasPuppeteer, hasPock, hasTravis } = answers,
				excludes = ['.dulu.js'],
				templates = ['_package.json', 'LICENSE', 'rollup.config.js', 'rollup.dev.js', 'README.md'],
				transform = {
					'_package.json': 'package.json'
				};
			answers.keywords = answers.keywords ? answers.keywords.split(/\s+/) : [];

			if (!hasTravis) {
				excludes.push('.travis.yml');
			} else {
				templates.push('.travis.yml');
			}

			if (hasTest) {
				templates.push('test/index.test.js');
				if (!hasPuppeteer) {
					excludes.push('test/_puppeteer.js');
				}
				if (!hasPock) {
					excludes.push('test/_pock.js');
				}
			} else {
				excludes.push('test', 'example/test.html');
				if (!hasPock) {
					excludes.push('.pockrc.yml', 'example/router');
				}
				if (!hasPuppeteer) {
					excludes.push('.npmrc');
				}
			}

			return {
				excludes,
				templates,
				transform
			};
		}
	};
};
