import mongoose from 'mongoose';
import cuid from 'cuid';
import { expect } from 'chai';

import { transactionState, transactionStepState } from '../constants/states';
import TransactionLogModel from '../models/transaction_log';
import * as helpers from './transaction_execution';
import serverConfig from '../config';

describe(`Test helper functions`, function () {
  const id = 'cjxtj5ui00000nal076n56i57';
  const transactionName = `transaction-${id}`;

  it('Tests ID extraction', function () {
    const calculatedId = helpers.getTransactionId(transactionName);

    expect(calculatedId).to.equal(id);
  });
});

describe(`Test log status update`, function () {
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
  const output = [
    { index: 1, result: {} },
  ];
  const status = [
    { index: 1, state: transactionStepState.PENDING },
  ];
  let transaction = null;

  before(async function () {
    // Mongoose setup
    mongoose.Promise = global.Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    // MongoDB Connection
    await mongoose.connect(serverConfig.mongoUrl, {
      useNewUrlParser: true,
      reconnectTries: 120,
      connectTimeoutMS: 500,
      autoReconnect: true,
      poolSize: 20,
    });
    
    const object = new TransactionLogModel({
      transactionCuid: cuid(),
      input,
      output,
      status,
      overallStatus: transactionState.PENDING,
    });

    transaction = await object.save();
  });


  it('Checks if transaction overall status is updated successfully', async function() {
    const query = { transactionCuid: transaction.transactionCuid };
    const update = { overallStatus: transactionState.FINISHED };
    const options = { new: true };
    const result = await TransactionLogModel.findOneAndUpdate(query, update, options);

    expect(result).to.have.property('overallStatus');
    expect(result.overallStatus).to.equal(transactionState.FINISHED);
  });

  after(async function () {
    await TransactionLogModel.findOneAndDelete({ transactionCuid: transaction.transactionCuid });
  });
});
