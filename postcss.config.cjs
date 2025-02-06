module.exports = {
  plugins: [
    require("@csstools/postcss-oklab-function")({
      // Set to false to output only fallback values,
      // or true to preserve the original declaration as well.
      preserve: false,
      // Optionally disable the display-p3 fallback if you want only rgb.
      subFeatures: {
        displayP3: true,
      },
    }),
  ],
};
