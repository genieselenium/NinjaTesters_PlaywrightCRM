// cucumber.js
module.exports = {
  default: {
    require: ['src/stepDefinitions/**/*.js'],
    format: ['progress'],
    publishQuiet: true
  }
};