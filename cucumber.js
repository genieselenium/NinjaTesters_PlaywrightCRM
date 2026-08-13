// cucumber.js
module.exports = {
  default: {
    paths: ["src/features/**/*.feature"],
    require: ['src/stepDefinitions/**/*.js'],
    format: ['progress'],
    publishQuiet: true
  }
};