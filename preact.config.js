import path from 'path';
import getEnvironment from './env';

export default (config, env, helpers) => {
  config.plugins.push(
    new helpers.webpack.DefinePlugin({
      'process.env': JSON.stringify(getEnvironment(env.production)),
    })
  );

  const {
    loader: { options: babelConfig },
  } = helpers.getLoadersByName(config, 'babel-loader')[0];

  /* Support css prop for styling with goober. */
  babelConfig.plugins.unshift(
    require.resolve('@agney/babel-plugin-goober-css-prop')
  );

  /* Alias for ./src */
  config.resolve.alias.src = path.resolve(__dirname, 'src');

  if (env.isProd) {
    config.devtool = false;
  } else {
    config.resolve.alias['preact-cli-entrypoint'] = path.resolve(
      __dirname,
      'src',
      'dev.tsx'
    );
  }
};
