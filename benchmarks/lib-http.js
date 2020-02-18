'use strict';

const lhost = require('lib-host');
const lhttp = require('@mrazvan/lib-http');

// Endpoint handler
class Test {
  static sayHello() {
    return {hello: 'world'};
  }
}

// Decorate our class
lhttp.Controller('/')(Test);
// Decorate the endpoint
lhttp.Get('/')(Test, 'sayHello');
// Decorate the endpoint with the fast-json-stringify schema
lhttp.JsonSchema({
  type: 'object',
  properties: {
    hello: {
      type: 'string'
    }
  }
})(Test, 'sayHello');

// Build a host, register the server and bind the serializer and the controller
lhost.Host.build((container, host) => {
  lhttp.HTTPFactory.create(container, host.config.scope('http'))
    .addGlobalInterceptor(lhttp.JsonSerializer)
    .addModule(lhttp.DynamicModule('MyModule', { controllers: [Test] }))
}).start({
  log: {
    level: 'None'
  },
  http: {
    port: 3000
  }
});