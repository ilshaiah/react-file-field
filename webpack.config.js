const path = require('path');


module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, '/dist'),
		filename: "index.js"
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react']
				}
			}
		}]
	},
	externals: {
		jquery: 'jQuery',
		react: 'React'
	}
};