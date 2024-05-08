const endpoints = {
  customer: 'http://localhost:4201'
};

export const environment = {
  production: false,
  api: {
    customer: {
      getAll: `${endpoints.customer}/api/customer`
    }
  }
};
