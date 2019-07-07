import cuid from 'cuid';
import Chai from 'chai';
import ChaiHTTP from 'chai-http';

import { transactionState, transactionStepState } from '../server/constants/states';
import TransactionLogModel from '../server/models/transaction_log';
import server from '../server/server';

Chai.use(ChaiHTTP);

describe(`Test log status read`, function () {
  const input = {
    "callbackUrl": "http://localhost:8085",
    "transaction": [
      {
        "index": 1,
        "operation": {
          "method": "POST",
          "url": "http://localhost:8082/api/v1/booking",
          "params": {
            "userId": "5cfd63967363f4879f203e8a",
            "planeId": "gcfd63967363f4879f203e8a",
            "places": 2,
            "datetime": "2019-07-20 19:50:12.000Z"
          }
        },
        "compensation": {
          "method": "DELETE",
          "url": "http://localhost:8082/api/v1/booking",
          "dependencies": [
            {
              "fromStep": 1,
              "paramType": "path",
              "inputParamKey": "_id"
            }
          ]
        }
      }
    ],
  };
  const output = [{ index: 1, result: {} }];
  const status = [{ index: 1, state: transactionStepState.PENDING }];
  let transaction = null;

  before(async function () {
    const object = new TransactionLogModel({
      transactionCuid: cuid(),
      input,
      output,
      status,
      overallStatus: transactionState.PENDING,
    });

    transaction = await object.save();
  });


  it('Test GET /status/{id} endpoint', async function () {
    const response = await Chai.request(server)
      .get(`/api/v1/status/${transaction.transactionCuid}`)

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response).to.have.property('body');
    Chai.expect(response.body.overallStatus).to.equal(transactionState.PENDING);
  });

  after(async function () {
    await TransactionLogModel.findOneAndDelete({ transactionCuid: transaction.transactionCuid });
  });
});
