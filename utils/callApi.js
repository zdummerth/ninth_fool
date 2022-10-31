const callApi = async (url, method, body) => {
  const options = body
    ? {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    : {};

  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) throw json;
  // console.log('call api response', response)

  return json;
};

export default callApi;
