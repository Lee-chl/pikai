"use client";
import { useRef, useState } from "react";
import styles from "./SearchBar_Rating.module.css";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarRatingProps {
  isProduct: boolean;
  productId?: number;
}

interface SearchResultType {
  id: number;
  name: string;
  productId?: number;
}

export default function SearchBarRating({
  isProduct,
  productId,
}: SearchBarRatingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");

  let dummyData: { id: number; name: string; productId?: number }[] = [];
  if (isProduct) {
    dummyData = [
      {
        id: 1,
        name: "헤라 매트 틴트 ",
      },
      {
        id: 2,
        name: "헤라 글로우 틴트",
      },
    ];
  } else {
    dummyData = [
      {
        id: 6,
        name: "레드",
        productId: 1,
      },
      {
        id: 11,
        name: "핑크",
        productId: 2,
      },
    ];
  }

  const [results, setResults] = useState<SearchResultType[]>(dummyData); //[]
  // AbortController는 비동기 작업을 중간에 취소 할 수 있게 해주는 객체
  const controllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (text: string) => {
    setKeyword(text);

    if (!text.trim()) {
      return setResults([]);
    }

    if (!isProduct && !productId) {
      setResults([]);
      return;
    }

    const filtered = dummyData.filter((item) => {
      const matchesKeyword = item.name.includes(text);
      if (isProduct) {
        return matchesKeyword;
      } else {
        return matchesKeyword && item.productId === productId;
      }
    });
    setResults(filtered);
  };

  const handleClick = (item: {
    id: number;
    name: string;
    productId?: number;
  }) => {
    setKeyword(item.name);
    setResults([]); // 리스트 닫기
    const params = new URLSearchParams(searchParams.toString());
    if (isProduct) {
      params.set("productId", String(item.id));

      // 새로 바꾸면 기존에 골라둔 컬러 id는 유효하지 않으므로 삭제합니다.
      params.delete("id");
    } else {
      params.set("id", String(item.id));
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return; // 엔터키가 아니면 무시
    if (!keyword.trim()) return; // 빈 입력창이면 무시

    // 정확히 일치하는 이름이 목록에 있는지 확인
    const exactMatch = results.find(
      (item) => item.name.trim() === keyword.trim(),
    );

    if (exactMatch) {
      handleClick(exactMatch);
    } else {
      const params = new URLSearchParams(searchParams.toString());

      if (isProduct) {
        params.set("newProduct", keyword);
        params.delete("productId"); // 기존 상품 id 있다면 초기화
        return;
      } else {
        params.set("newColor", keyword);
      }

      setResults([]); // 리스트 닫기
      alert(`사이트에 등록되지 않은 상품입니다. 새로 추가합니다.`);
    }
  };

  // TODO: 추후 검색 개발 후 다시 개발
  // useEffect(() => {
  //   if (!keyword.trim()) {
  //     setResults([]);
  //     return;
  //   }
  //   let url = `${Constants.back_url}`;
  //   if (isProduct) {
  //     // url += `브랜드 검색 주소?keyword=${encodeURIComponent(keyword)}`;
  //     url += ``;
  //   } else {
  //    브랜드 클릭 시에 Product ID로 넣어서 보내주기!

  //     // url += `상품 검색 주소?keyword=${encodeURIComponent(keyword)}`;
  //     url += ``;
  //   }
  //
  //   const timer = setTimeout(async () => {
  //     // 이전 요청 취소
  //     controllerRef.current?.abort();
  //     const controller = new AbortController();
  //     // 새 요청을 넣어준다.
  //     controllerRef.current = controller;
  //
  //     try {
  //       const response = await fetch(url, {
  //         // 담당 컨트롤러 연결
  //         signal: controller.signal,
  //       });
  //
  //       if (!response.ok) {
  //                 const errorData = await response.json();
  //           throw new Error(errorData.message);
  //
  //       }
  //
  //       const data = await response.json();
  //       setResults(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [keyword]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        {/*<input*/}
        {/*  value={keyword}*/}
        {/*  className={styles.searchInput}*/}
        {/*  onChange={(e) => setKeyword(e.target.value)}*/}
        {/*  placeholder="검색어를 입력하세요"*/}
        {/*/>*/}
        <input
          value={keyword}
          className={styles.searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={isProduct ? "브랜드를 선택하세요" : "컬러를 선택하세요"}
          onKeyDown={handleKeyDown}
        />
        <Search className={styles.searchIcon} />
      </div>
      {results.length > 0 && (
        <ul className={styles.resultList}>
          {results.map((item) => (
            <li
              key={item.id}
              className={styles.resultItem}
              onClick={() => {
                handleClick(item);
              }}
            >
              <span className={styles.itemName}>{item.name} </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
