import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './TopNav.css';

export default function TopNav() {
  const loc = useLocation();
  const nav = useNavigate();

  return (
    <header className="topnav">
      <div className="topnav__brand" onClick={() => nav('/filters')}>
        인력관리
      </div>
      <nav className="topnav__links">
        <NavLink to="/filters" className={({isActive}) => isActive ? 'active' : ''}>
          필터 개선
        </NavLink>
        <NavLink to="/notice" className={({isActive}) => isActive ? 'active' : ''}>
          공지사항 개선
        </NavLink>
        <NavLink to="/mypage" className={({isActive}) => isActive ? 'active' : ''}>
          마이페이지
        </NavLink>
      </nav>
      <div className="topnav__path">{loc.pathname}</div>
    </header>
  );
}
