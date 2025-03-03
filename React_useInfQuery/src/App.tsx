import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';

// 사용할 데이터에 대한 타입명시
type TData = {
  id: string;
  url: string;
};

// 사용할 API 상수로 선언
const API_URL =
  'https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=0&limit=10';

// 데이터 패칭함수 선언
// - pageParam을 받아서 페이지 값을 URL에 추가하여 요청을 보냄
// - 기본값은 첫페이지인 0으로 설정
const fetchData = async ({ pageParam = 0 }): Promise<TData[]> => {
  const response = await axios.get<TData[]>(`${API_URL}${pageParam}`);
  return response.data;
};

const App = () => {
  // useInfiniteQuery를 사용하여 데이터 비동기 처리
  // - initialPageParam : 첫 페이지 부터 시작
  // - getNextPageParam : 현재 페이지를 기반으로 다음 페이지 번호 설정
  // - fetchNextPage() : 다음 페이지를 요청하는 함수
  // - hasNextPage : 다음 페이지가 있는지 여부
  // - isFetchNextPage : 다음 페이지를 불러오는 중인지 여부
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } = useInfiniteQuery({
    queryKey: ['getData'],
    queryFn: fetchData,
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => allPages.length,
    staleTime: 1000 * 5 * 60, // 빠른 업데이트가 필요한건 아니닌 staletime은 일반적인 5분으로 설정
  });

  // Intersection Observer가 감지할 대상 요소를 저장
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Intersection Observer를 사용하여 마지막 요소가 화면에 보일때 자동으로 데이터 요청
    // - hasNextPage와 isFetchingNextPage를 체크하여 중복 요청을 방지.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage(); // 다음 페이지 데이터 불러오기
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full flex flex-col justify-center items-center p-2 gap-2">
      <h1 className="text-[50px] font-bold">Dog Images Inf Scroll</h1>
      <div className="min-h-full grid grid-auto-flow grid-cols-3 mt-10 gap-2">
        {isLoading && <p> Loading.. </p>}
        {isError && <p>Error : {error?.message}</p>}
        {data?.pages?.map((page) =>
          page.map((item) => (
            <div key={item.id} className="flex flex-col items-center mb-10">
              <img src={item.url} alt="dog" className="w-[300px] h-[150px] object-cover" />
              <p>{item.id}</p>
            </div>
          ))
        )}
      </div>

      {/* 
        무한 스크롤 감지 영역 
        - 이 영역에 들어오면 조건을 만족할때 데이터를 추가로 불러옴 
      */}
      <div ref={loadMoreRef} className="w-full h-10 flex justify-center items-center">
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </div>
  );
};
export default App;
