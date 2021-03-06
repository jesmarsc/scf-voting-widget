import path from 'path';

export default (config, env, helpers) => {
  const { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
  const babelConfig = rule.options;

  /* Support css prop for styling with goober. */
  babelConfig.plugins.unshift(
    require.resolve('@agney/babel-plugin-goober-css-prop')
  );

  /* Alias for ./src */
  config.resolve.alias.src = path.resolve(__dirname, 'src');

  if (env.isProd) {
    config.devtool = false;
  }
};
