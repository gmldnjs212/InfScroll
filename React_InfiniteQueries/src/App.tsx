import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL =
  'https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=0&limit=10';

const fetchData = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const App = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['getData'],
    queryFn: fetchData,
  });
  return (
    <>
      {isLoading && <p> loading.. </p>}
      {isError && <p>Error : {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
};
export default App;
