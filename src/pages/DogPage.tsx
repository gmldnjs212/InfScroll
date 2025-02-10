import { useEffect, useState } from 'react';
import { getDogImages } from '../api/api';

interface DogImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

const DogPage = () => {
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
      console.log(result);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center p-2 gap-2">
      <h1 className="text-[50px] font-bold">Dog Images Inf Scroll</h1>
      <div className="min-h-full grid grid-auto-flow grid-cols-3 gap-2">
        {Array.isArray(data) ? (
          data.map((item) => (
            <div key={item.id || item.url}>
              <img src={item.url} alt={item.url} className="w-[300px] h-[150px] object-cover" />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
export default DogPage;
