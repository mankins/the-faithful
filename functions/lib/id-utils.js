exports.dePrefix = (thing) => {
  // tid-abc => abc
  // xyz => xyz
  return thing.replace(/^[^-]+-/, '');
};
