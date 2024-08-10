const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './js/index.js', // Adjust the path to your entry file
        aiPersona: './1-ResumeScreening/ai-persona/ai-persona.js', // Adjust the path to your entry file
        aiCreationResult: './1-ResumeScreening/public/js/aicreationresult.js', // Adjust the path to your entry file
        aiCreation: './1-ResumeScreening/public/js/aicreation.js', // Adjust the path to your entry file
        resumeHome: './1-ResumeScreening/public/js/resumehome.js', // Adjust the path to your entry file
        talentPool: './1-ResumeScreening/public/js/talentpool.js', // Adjust the path to your entry file
        aiPick: './1-ResumeScreening/public/js/aipick.js', // Adjust the path to your entry file
        webFlow: './js/webflow.js', // Adjust the path to your entry file
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    externals: {
        fs: 'commonjs fs',
    },
};