const getGreenApi = (
  method: string,
  idInstance: string,
  apiTokenInstance: string
) =>
  `https://api.green-api.com/waInstance${idInstance}/${method}/${apiTokenInstance}`;

export default getGreenApi;
