import React, { useMemo, useState } from "react";
import "./NoticePage.css";

const CATEGORY = [
  { value: "사업장", details: ["부산1공장", "부산2공장", "김해지점"] },
  { value: "안전", details: ["작업허가", "교육공지", "장비점검"] },
  { value: "인사", details: ["채용", "휴가", "복지"] },
];

export default function NoticePage() {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [detail, setDetail] = useState("");
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleErr = touched.title && title.trim().length === 0;
  const contentErr = touched.content && content.trim().length === 0;

  const details = useMemo(() => {
    const found = CATEGORY.find(c => c.value === category);
    return found ? found.details : [];
  }, [category]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, content: true });
    
    if (title.trim() && content.trim()) {
      setIsSubmitting(true);
      
      // 실제 저장 로직 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("저장되었습니다.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  return (
    <form className="card grid" onSubmit={onSubmit} noValidate>
      <div className="col-main">
        {/* 제목 */}
        <div className={`field ${titleErr ? "error" : ""}`}>
          <label htmlFor="title">
            <span className="req">*</span> 제목
          </label>
          <div className="input-with-counter">
            <input
              id="title"
              type="text"
              maxLength={120}
              placeholder="예: 9월 안전점검 일정 안내"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              aria-invalid={titleErr}
              aria-describedby="titleHelp"
            />
            <span className="counter">{title.length}/120</span>
          </div>
          {titleErr && (
            <p id="titleHelp" className="help error-text">
              필수 입력 항목입니다.
            </p>
          )}
        </div>

        {/* 구분 / 구분 상세 */}
        <div className="row-2">
          <div className="field">
            <label htmlFor="cat">구분</label>
            <select
              id="cat"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setDetail("");
              }}
            >
              <option value="">선택하세요</option>
              {CATEGORY.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.value}
                </option>
              ))}
            </select>
          </div>

          <div className={`field ${!category ? "disabled" : ""}`}>
            <label htmlFor="detail">구분 상세</label>
            <select
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              disabled={!category}
            >
              <option value="">
                {category ? "상세를 선택하세요" : "먼저 구분을 선택하세요"}
              </option>
              {details.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 내용 */}
        <div className={`field ${contentErr ? "error" : ""}`}>
          <label htmlFor="content">
            <span className="req">*</span> 내용
          </label>
          <div className="textarea-wrap">
            <textarea
              id="content"
              rows={10}
              maxLength={1000}
              placeholder={`예: 
- 점검 기간: 9/20(월)~9/22(수)
- 대상: 부산1공장 전 라인
- 유의사항: 점검 중 설비 가동 제한`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, content: true }))}
              aria-invalid={contentErr}
              aria-describedby="contentHelp"
            />
            <span className="counter">{content.length}/1000</span>
          </div>
          {contentErr && (
            <p id="contentHelp" className="help error-text">
              필수 입력 항목입니다.
            </p>
          )}
        </div>
      </div>

      {/* 사이드(종료일 + 미리보기) */}
      <aside className="col-side">
        <div className="field">
          <label htmlFor="end">종료일</label>
          <input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <p className="help">미설정 시 공지가 계속 노출됩니다.</p>
        </div>

        <div className="preview">
          <h3>미리보기</h3>
          <h4>{title || "제목 미입력"}</h4>
          <p className="muted">
            {category || "구분 없음"}
            {detail ? ` · ${detail}` : ""}
            {endDate ? ` · 종료 ${endDate}` : ""}
          </p>
          <div className="preview-body">
            {(content || "내용이 없습니다.").split("\n").map((ln, i) => (
              <p key={i}>{ln || "\u00A0"}</p>
            ))}
          </div>
        </div>
      </aside>

      {/* 고정 하단 액션 */}
      <div className="sticky-actions">
        <button 
          type="button" 
          className="btn ghost" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          취소
        </button>
        <div className="spacer" />
        <button 
          type="submit" 
          className="btn primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
