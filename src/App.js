import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import FilterPage from './pages/filter/FilterPage';
import NoticePage from './pages/notice/NoticePage';
import MyPage from './pages/mypage/MyPage';

function Home() {
  const nav = useNavigate();
  return (
    <div className="home">
      <h1 className="home__title">개선</h1>
      <p className="home__subtitle">원하는 기능을 선택하세요</p>

      <div className="home__grid">
        <button className="home__card" onClick={() => nav("/filters")}>
          <div className="home__emoji">🔎</div>
          <div className="home__cardTitle">필터 개선</div>
          <div className="home__desc">컬럼별 필터를 팝업으로 쉽게 적용</div>
        </button>

        <button className="home__card" onClick={() => nav("/notice")}>
          <div className="home__emoji">📣</div>
          <div className="home__cardTitle">공지사항 개선</div>
          <div className="home__desc">기발한 입력폼 + 라이브 미리보기</div>
        </button>

        <button className="home__card" onClick={() => nav("/mypage")}>
          <div className="home__emoji">👤</div>
          <div className="home__cardTitle">마이페이지</div>
          <div className="home__desc">개인정보 수정 & 사인 등록</div>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filters" element={<FilterPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
