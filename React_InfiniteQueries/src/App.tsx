import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 사용할 데이터에 대한 타입명시
type TData = {
  id: string;
  url: string;
};

// 사용할 API 상수로 선언
const API_URL =
  'https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=0&limit=10';

// 데이터 패칭함수 선언
const fetchData = async (): Promise<TData[]> => {
  const response = await axios.get<TData[]>(API_URL);
  return response.data;
};

const App = () => {
  // useQuery를 사용하여 데이터 비동기 처리
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['getData'],
    queryFn: fetchData,
  });
  return (
    <div className="w-full flex flex-col justify-center items-center p-2 gap-2">
      <h1 className="text-[50px] font-bold">Dog Images Inf Scroll</h1>
      <div className="min-h-full grid grid-auto-flow grid-cols-3 mt-10 gap-2">
        {isLoading && <p> Loading.. </p>}
        {isError && <p>Error : {error?.message}</p>}
        {data?.map((item) => (
          <div key={item.id} className="flex flex-col items-center mb-10">
            <img src={item.url} alt={item.url} className="w-[300px] h-[150px] object-cover" />
            <p>{item.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
