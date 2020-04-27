let sinon = require("sinon");

module.exports = class Stub {
  constructor(object) { this._obj = object };
  and = this;
  doesnt = () => this.notCalled = true;
  receive = this.receives;
  receives = (key) => {
    switch (this.notCalled) {
      case true:
        afterEach(() => {
          sinon.assert.notCalled(this.stub);
        });
        break;
      default:
        this._obj[key] = sinon.stub();
        this.stub = this._obj[key];
        break;
    };
    return this;
  };
  onCall = (callNumber) => {
    this.call = callNumber;
    return this;
  };
  executes = (callback) => {
    this.stub.callsFake(callback);
    return this;
  };
  andReturns = (value) => {
    this.call ?
      this.stub.onCall(this.call).returns(value)
      :
      this.stub.returns(value);
    return this;
  };
  andResolves = (value) => {
    this.call ?
      this.stub.onCall(this.call).resolves(value)
      :
      this.stub.resolves(value);
    return this;
  };
  andRejects = (value) => {
    this.call ?
      this.stub.onCall(this.call).rejects(value)
      :
      this.stub.rejects(value);
    return this;
  };
  with = (...args) => {
    this.args = args;
    afterEach(() => {
      this.call ?
        sinon.assert.calledWithExactly(this.stub.getCall(this.call), ...this.args)
        :
        sinon.assert.calledWithExactly(this.stub, ...this.args)
    });
    return this;
  };
  new = () => {
    afterEach(() => {
      sinon.assert.calledWithNew(this.stub)
    });
    return this;
  };
};