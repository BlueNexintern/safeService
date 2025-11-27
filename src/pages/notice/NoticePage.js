import React, { useRef, useState } from "react";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import "./NoticePage.css";

// 문자열 안전 변환 (NaN 등 방지)
const toStr = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

function validatePayload({ title, content }) {
  const titleOk = typeof title === "string" && title.trim().length > 0;
  const contentOk = typeof content === "string" && content.trim().length > 0;
  return { titleOk, contentOk, valid: titleOk && contentOk };
}

function PreviewItem({ label, children, className = "" }) {
  return (
    <div className={`preview-item ${className}`}>
      <strong className="preview-label">{label}</strong>
      <div className="preview-value">{children}</div>
    </div>
  );
}

export default function NoticePage() {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState({ title: false, content: false });

  const endDateRef = useRef(null);

  const categories = {
    공지: ["일반", "긴급", "변경"],
    행사: ["세미나", "워크숍", "설명회"],
    학사: ["수업", "시험", "휴·보강"],
  };

  const subOptions = categories[category] ?? [];
  const isTitleError = touched.title && title.trim() === "";
  const isContentError = touched.content && content.trim() === "";

  const filled = [title, endDate, category, subcategory, content]
    .map(toStr)
    .filter((v) => v.trim() !== "").length;
  const progress = Math.round((filled / 5) * 100) || 0;

  const reset = () => {
    setTitle("");
    setEndDate("");
    setCategory("");
    setSubcategory("");
    setContent("");
    setTouched({ title: false, content: false });
  };

  const onSave = (e) => {
    e.preventDefault();
    setTouched({ title: true, content: true });
    const { valid } = validatePayload({ title, content });
    if (!valid) return;

    const payload = { title, endDate, category, subcategory, content };
    console.log("Saving notice:", payload);
    alert("저장되었습니다. 콘솔에서 payload를 확인하세요.");
  };

  const openDatePicker = () => {
    const el = endDateRef.current;
    if (!el) return;
    try {
      el.focus();
      if (typeof el.showPicker === "function") {
        try {
          el.showPicker();
          return;
        } catch {}
      }
      el.click();
    } catch {}
  };

  return (
    <div className="notice-container">
      <div className="progress-wrapper">
        <div className="progress-labels">
          <span>작성 진행도</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={onSave} className="form-wrapper">
        {/* 첫 줄: 제목 / 종료일 */}
        <div className="grid-row">
          <div className="grid-left">
            <label>
              제목 <span className="required">*</span>
            </label>
            <div className="field-with-count">
              <input
                type="text"
                value={title}
                maxLength={120}
                onChange={(e) => setTitle(e.target.value ?? "")}
                onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                placeholder="예: 9월 안전점검 일정 안내"
                className={isTitleError ? "input-error" : "input-normal"}
              />
              <span className="char-count">{toStr(title).length}/120</span>
            </div>
            {isTitleError && <p className="error-msg">필수 입력 항목입니다.</p>}
          </div>

          <div
            className="grid-right"
            onClick={openDatePicker}
            role="button"
            tabIndex={0}
          >
            <label>종료일</label>
            <input
              ref={endDateRef}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value ?? "")}
              className="input-normal"
              min={new Date().toISOString().split("T")[0]}
            />
            <p className="helper-text">미설정시 공지가 계속 노출됩니다.</p>
          </div>
        </div>

        {/* 둘째 줄: 구분/구분상세 + 미리보기 */}
        <div className="grid-row">
          <div className="grid-left">
            <div className="dropdown-row">
              <div>
                <label>구분</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value ?? "");
                    setSubcategory("");
                  }}
                  className="input-normal"
                >
                  <option value="">선택하세요</option>
                  {Object.keys(categories).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>구분 상세</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value ?? "")}
                  className="input-normal"
                >
                  <option value="">
                    {category ? "선택하세요" : "먼저 구분을 선택해주세요"}
                  </option>
                  {subOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 내용 입력 */}
            <div className="mt-4">
              <label>
                내용 <span className="required">*</span>
              </label>
              <div className="field-with-count">
                <textarea
                  value={content ?? ""}
                  maxLength={1000}
                  onChange={(e) => setContent(e.target.value ?? "")}
                  onBlur={() => setTouched((t) => ({ ...t, content: true }))}
                  placeholder={`예:\n- 점검 기간: 9/20(월)~9/22(수)\n- 대상: 부산1공장 전 라인\n- 유의사항: 점검 중 설비 가동 제한`}
                  rows={12}
                  className={isContentError ? "input-error" : "input-normal"}
                />
                <span className="char-count">{toStr(content).length}/1000</span>
              </div>
              {isContentError && (
                <p className="error-msg">필수 입력 항목입니다.</p>
              )}
            </div>
          </div>

          {/* 미리보기 */}
          <div className="grid-right preview-box">
            <div className="preview-header">
              <Eye size={18} />
              <h3>미리보기</h3>
            </div>

            <div className="preview-content">
              {/* 제목 */}
              {toStr(title) ? (
                <PreviewItem label="제목" className="pv-shift-4">
                  {toStr(title)}
                </PreviewItem>
              ) : (
                <div className="preview-title-empty">제목 미입력</div>
              )}

              {/* ✅ 종료일 (추가) */}
              {toStr(endDate) && (
                <PreviewItem label="종료일" className="pv-shift-4">
                  {toStr(endDate)}
                </PreviewItem>
              )}

              {/* 구분/구분상세 */}
              {toStr(category) || toStr(subcategory) ? (
                <div className="preview-row">
                  {toStr(category) && (
                    <PreviewItem label="구분" className="pv-shift-4">
                      {toStr(category)}
                    </PreviewItem>
                  )}
                  {toStr(subcategory) && (
                    <PreviewItem label="구분 상세">
                      {toStr(subcategory)}
                    </PreviewItem>
                  )}
                </div>
              ) : (
                <div className="preview-badge muted">구분 없음</div>
              )}

              {/* 내용 */}
              <div className="preview-item preview-text_label">
                <strong className="preview-label">내용</strong>
                <div className="preview-value">
                  {toStr(content) ? toStr(content) : "내용이 없습니다."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="footer-row">
          <button type="button" onClick={reset} className="btn-cancel">
            취소
          </button>
          <button type="submit" className="btn-save">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
