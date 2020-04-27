let expect = require("chai").expect;

module.exports = class Assertion {
  constructor(object) { this._obj = object };
  and = this;

  toHaveProperties = (props) => {
    Object.keys(props).forEach(key => {
      expect(this._obj[key]).to.eq(props[key]);
    });
  };
  toLooselyHaveProperties = (props) => {
    Object.keys(props).forEach(key => {
      expect(this._obj[key]).to.eql(props[key]);
    });
  };
  whenCalledWith = (...args) => {
    this.args = args;
    return this;
  };
  should = (assertions) => {
    if (assertions) { this.assertions = assertions };
    return this;
  };
  throwAsyncError = async (errorMessage) => {
    let result = await this._obj(...this.args).catch(error => error);
    expect(result.message).to.eq(errorMessage);
    if (this.assertions) { this.assertions() };
  };

  loosely = () => {
    this.loosely = true;
    return this;
  };

  return = (expectedResult) => {
    let result = this._obj(...this.args);
    this.loosely ? expect(result).to.eql(expectedResult) : expect(result).to.eq(expectedResult);
    if (this.assertions) { this.assertions(result) };
  };

  resolve = async (expectedResult) => {
    let result = await this._obj(...this.args).catch(error => error);
    this.loosely ? expect(result).to.eql(expectedResult) : expect(result).to.eq(expectedResult);
    if (this.assertions) { this.assertions(result) };
  };

  succeed = async () => {
    let result = await this._obj(...this.args).catch(error => error);
    if (this.assertions) { this.assertions(result) };
  };
};