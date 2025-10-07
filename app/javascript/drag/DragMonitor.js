let activeDragCount = 0;
let afterDragCallbacks = [];

export const notifyDragStart = () => {
  activeDragCount += 1;
};

export const notifyDragEnd = () => {
  if (activeDragCount === 0) {
    return;
  }

  activeDragCount -= 1;

  if (activeDragCount === 0) {
    const callbacks = afterDragCallbacks;
    afterDragCallbacks = [];
    callbacks.forEach((callback) => {
      callback();
    });
  }
};

export const runAfterDrag = (callback) => {
  if (activeDragCount === 0) {
    callback();
    return;
  }

  afterDragCallbacks.push(callback);
};

export const hasActiveDrag = () => activeDragCount > 0;
