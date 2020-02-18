'use strict';

const lhost = require('lib-host');
const lhttp = require('@mrazvan/lib-http');

function Employee ({ id = null, title = null, employer = null } = {}) {
  this.id = id
  this.title = title
  this.employer = employer
}
// Endpoint handler
class Test {
  static sayHello() {
    const jobs = [];
    for (let i = 0; i < 200; i += 1) {
      jobs[i] = new Employee({
        id: i,
        title: 'Software engineer',
        employer: 'Fastify' // Keep the same 'amount' of data we send
      })
    }
      return jobs;
  }
}

// Decorate our class
lhttp.Controller('/')(Test);
// Decorate the endpoint
lhttp.Get('/')(Test, 'sayHello');
// Decorate the endpoint with the fast-json-stringify schema
lhttp.JsonSchema({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      employer: { type: 'string' }
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