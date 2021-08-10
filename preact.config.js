export default (config, env, helpers) => {
  const { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
  const babelConfig = rule.options;

  babelConfig.plugins.unshift(
    require.resolve('@agney/babel-plugin-goober-css-prop')
  );

  if (env.isProd) {
    config.devtool = false;
  }
};
