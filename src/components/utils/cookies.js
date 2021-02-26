const getCookies = (req) => {
  return req.split(';').reduce((res, item) => {
    const data = item.trim().split('=');
    return { ...res, [data[0]]: data[1] };
  }, {});
};

export { getCookies };
