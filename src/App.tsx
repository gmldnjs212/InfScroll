import { useEffect, useState } from 'react';
import { getDogImages } from './api/api';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDogImages({
        size: 'small',
        format: 'json',
        has_breeds: true,
        order: 'ASC',
        page: 0,
        limit: 10,
      });
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default App;
