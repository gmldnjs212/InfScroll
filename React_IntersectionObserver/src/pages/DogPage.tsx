import { useEffect, useState } from 'react';
import axios from 'axios';

interface DogImage {
  id: string;
  url: string;
}

const DogPage = () => {
  const [data, setData] = useState<DogImage[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Intersection Observer 설정
  const handlerObeserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handlerObeserver, {
      threshold: 0,
      // 0이면 교차점이 한번만 실행해도 실행, 모든 영역이 교차해야 콜백함수가 실행됨.
    });
    // 최하단 요소를 관찰 대상으로 지정
    const observerTarget = document.getElementById('observer');
    // 관찰 시작
    if (observerTarget) {
      observer.observe(observerTarget);
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const API_URL = `https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=${page}&limit=10`;
      const res = await axios.get(API_URL);
      const newData = res.data.map((dogImg: { id: string; url: string }) => ({
        id: dogImg.id,
        url: dogImg.url,
      }));
      // 불러온 데이터를 배열에 추가
      setData((prevData) => [...prevData, ...newData]);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="w-full flex flex-col justify-center items-center p-2 gap-2">
      <h1 className="text-[50px] font-bold">Dog Images Inf Scroll</h1>
      <div className="min-h-full grid grid-auto-flow grid-cols-3 mt-10 gap-2">
        {data &&
          data.map((item) => (
            <div key={item.id || item.url} className="flex flex-col items-center mb-10">
              <img src={item.url} alt={item.url} className="w-[300px] h-[150px] object-cover" />
              <p>{item.id}</p>
            </div>
          ))}
        {isLoading && <p>Loading...</p>}
        <div id="observer" className="h-2"></div>
      </div>
    </div>
  );
};
export default DogPage;
