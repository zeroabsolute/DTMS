export const transactionStepState = {
  PENDING: 'pending',
  TRANSACTION_STARTED: 'transaction-started',
  TRANSACTION_SUCCEEDED: 'transaction-succeeded',
  TRANSACTION_FAILED: 'transaction-failed',
  COMPENSATION_STARTED: 'compensation-started',
  COMPENSATION_SUCCEEDED: 'compensation-succeeded',
  COMPENSATION_FAILED: 'compensation-failed',
};

export const transactionState = {
  PENDING: 'pending',
  ONGOING: 'ongoing',
  FINISHED: 'finished',
  FAILED: 'failed',
};

export const actions = {
  TRANSACTION: 'transaction',
  COMPENSATION: 'compensation',
};