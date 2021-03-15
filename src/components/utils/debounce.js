const cloneArray = (list) => Array.prototype.slice.apply(list);

let inDebounce;

export const debounce = (func, delay) => {
  return function () {
    const _this = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(_this, args), delay);
  };
};

export const cumulativeArgumentDebounce = (func, delay) => {
  let inDebounce;
  const args = [];
  return function () {
    const _this = this;
    args.push(cloneArray(arguments));
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func.apply(_this, [cloneArray(args)]);
      args.length = 0;
    }, delay);
  };
};

export default {
  debounce,
  cumulativeArgumentDebounce,
};
