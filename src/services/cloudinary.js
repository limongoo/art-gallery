const FETCH_URL = '	https://res.cloudinary.com/dph3nw8ym/image/fetch';

export const getUrl = (fileName, options = '') => {
  return `${FETCH_URL}/${options}/${fileName}`;
};