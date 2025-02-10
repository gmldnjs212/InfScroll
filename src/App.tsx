import { useEffect, useState } from 'react';
import { getDogImages } from './api/api';

interface DogImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

const App = () => {
  const [data, setData] = useState<DogImage[]>([]);

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
      // console.log(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        {Array.isArray(data) ? (
          data.map((item) => (
            <div key={item.id || item.url}>
              <div>{item.url}</div>
            </div>
          ))
        ) : (
          <p>Loading...</p> // 혹은 오류 메시지 처리
        )}
      </div>
    </>
  );
};

export default App;
