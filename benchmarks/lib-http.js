const lhost = require('lib-host');
const lhttp = require('@mrazvan/lib-http');

class Test {
  static sayHello() {
    return {hello: 'world'};
  }
}

// Decorate our class
lhttp.Controller('/')(Test);
lhttp.Get('/')(Test, 'sayHello');
lhttp.JsonSchema({
  type: 'object',
  properties: {
    hello: {
      type: 'string'
    }
  }
})(Test, 'sayHello');

lhost.Host.build((container, host) => {
  lhttp.HTTPFactory.create(container, host.config.scope('http'))
    .addGlobalInterceptor(lhttp.JsonSerializer)
    .addModule(lhttp.DynamicModule('MyModule', { controllers: [Test] }))
}).start({
  log: {
    instances: {
      Config: 'Warn'
    }
  },
  http: {
    port: 3000
  }
});