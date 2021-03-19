const pick = (obj) => (fields) => {
  const res = {};
  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      res[field] = obj[field];
      Object.assign(res, { [field]: obj[field] });
    }
  });
  return res;
};
export default pick;
