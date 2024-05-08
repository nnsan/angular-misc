const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'customer',

  exposes: {
    './Module': './projects/customer/src/app/order/order.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  // Explicitly share mono-repo libs:
  sharedMappings: ['shared'],

});
