module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stellar: {
          purple: '#3e1bdb',
          salmon: '#ff434b',
          green: '#20bf6b',
          yellow: '#ffb200',
        },
      },
      boxShadow: (theme) => ({
        purple: `0px 8px 16px -8px ${theme('colors.stellar.purple')}`,
        salmon: `0px 8px 16px -8px ${theme('colors.stellar.salmon')}`,
        green: `0px 8px 16px -8px ${theme('colors.stellar.green')}`,
      }),
    },
  },
  plugins: [],
};
