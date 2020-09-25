type Callback = () => void;

// Default to a dummy "batch" implementation that just runs the callback
function defaultNoopBatch(callback: Callback) {
  callback();
}

type Batch = (callback: Callback) => void;
let batch: Batch = defaultNoopBatch;

// Allow injecting another batching function later
// eslint-disable-next-line no-return-assign
export const setBatch = (newBatch: Batch): Batch => (batch = newBatch);

// Supply a getter just to skip dealing with ESM bindings
export const getBatch = (): Batch => batch;
