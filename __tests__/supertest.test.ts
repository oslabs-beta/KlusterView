import request from 'supertest';
import app from '../server/server';
import grafanaRouter from '../server/routes/grafanaRouter';
import promRouter from '../server/routes/promRouter';

//**************************TESTS FOR SERVER.TS *********************/

// beforeAll(async () => {
//   server = app.listen(3000, () => {
//     console.log('test server started');
//   }); // Start the server and store the instance
// });

// afterAll((done) => {
//   server.close(done); // Close the server when all tests are finished
// });

describe('serving HTML files', () => {
  it('should respond with status 200 if successfully served static files', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html; charset=[uU][tT][fF]-8/)
      .expect(200)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('Other endpoint router', () => {
  it('should respond with status 404 and return "Not found"', (done) => {
    request(app)
      .get('/testing123')
      .expect(404)
      .end((err, response) => {
        if (err) return done(err);

        expect(response.body).toBe('Not found');
        done();
      });
  });
});

//**************************TESTS FOR promRouter.TS *********************/

describe('Prom Router', () => {
  it('should get data from PromAPI', async () => {
    const response = await request(app).get('/prom/pods/');
    expect(response.status).toBe(200);
  });
  it('server should respond with an array of objects that should contain a name and ip property', async () => {
    const response = await request(app).get('/prom/pods/');
    expect(response.body.length).toBeGreaterThan(0);
    expect(typeof response.body[0].name).toBe('string');
    expect(typeof response.body[0].ip).toBe('string');
  });
  it('server should respond with status of 200 if the pods are running', async () => {
    const response = await request(app).get('/prom/pod/status');
    expect(response.status).toBe(200);
    expect(response.body['kube-scheduler-minikube']).toBe('Running');
  });
  it('server should respond with an object that contains array of pod names', async () => {
    const response = await request(app).get('/prom/pods/nodes');
    expect(response.status).toBe(200);
    expect(response.body['minikube'].length).toBeGreaterThan(0);
  });
});

//**************************TESTS FOR grafanaRouter.TS *********************/

describe('/grafana', () => {
  it('server should respond with status code 200 if successfully retrieved dashboard', async () => {
    const response = await request(app).get('/grafana/pods');
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('string');
    expect(response.body.indexOf('http')).toBe(0);
  });
});

describe('GET /grafana/pods', () => {
  test('server should response with status code 200', async () => {
    const response = await request(app).get('/grafana/dashboard');
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('string');
    expect(response.body.indexOf('http')).toBe(0);
  });
});

//**************************TESTS FOR statusRouter.TS *********************/

describe('/status', () => {
  it('should check Kubernetes status', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
  });
  it('server should respond with status code 200 if grafana is initialized', async () => {
    const response = await request(app).get('/status/init');
    expect(response.status).toBe(200);
  });
  it('server should respond with status code 200 if grafana and prometheus are correctly set up', async () => {
    const response = await request(app).post('/status/setup');
    expect(response.status).toBe(200);
  });
});
