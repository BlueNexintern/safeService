import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './MyPage.css';

export default function MyPage() {
  // 조회 전용 필드 (수정 불가)
  const [readOnlyData] = useState({
    companyCode: 'COMP001',
    userId: 'user123',
    employeeNumber: 'EMP2024001',
    workplaceCode: 'WP001',
    position: '과장',
    department: '개발팀'
  });

  // 수정 가능한 필드
  const [formData, setFormData] = useState({
    nickname: '이지원',
    phoneNumber: '010-1234-5678',
    birthDate: '19900101',
    nationality: '대한민국',
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);
  const [tabWidths, setTabWidths] = useState({});
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const signatureRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 변경사항 감지
    setHasChanges(true);
    
    // 실시간 유효성 검사
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (name === 'nickname' && !value.trim()) {
      newErrors.nickname = '사용자명은 필수 입력 항목입니다.';
    } else if (name === 'nickname' && value.trim()) {
      delete newErrors.nickname;
    }
    
    if (name === 'phoneNumber' && !value.trim()) {
      newErrors.phoneNumber = '전화번호는 필수 입력 항목입니다.';
    } else if (name === 'phoneNumber' && value.trim()) {
      delete newErrors.phoneNumber;
    }
    
    if (name === 'birthDate' && !value.trim()) {
      newErrors.birthDate = '생년월일은 필수 입력 항목입니다.';
    } else if (name === 'birthDate' && value.trim()) {
      delete newErrors.birthDate;
    }
    
    if (name === 'nationality' && !value.trim()) {
      newErrors.nationality = '국적은 필수 입력 항목입니다.';
    } else if (name === 'nationality' && value.trim()) {
      delete newErrors.nationality;
    }
    
    setErrors(newErrors);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result
        }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
    setHasChanges(true);
  };

  const openSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const closeSignatureModal = () => {
    setShowSignatureModal(false);
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signatureData = signatureRef.current.toDataURL();
      setSignatureData(signatureData);
      setHasChanges(true);
      setShowSignatureModal(false);
    } else {
      alert('서명을 먼저 작성해주세요.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 필드 터치 상태로 설정
    const allTouched = {
      nickname: true,
      phoneNumber: true,
      birthDate: true,
      nationality: true
    };
    setTouched(allTouched);
    
    // 유효성 검사
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = '사용자명은 필수 입력 항목입니다.';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = '전화번호는 필수 입력 항목입니다.';
    if (!formData.birthDate.trim()) newErrors.birthDate = '생년월일은 필수 입력 항목입니다.';
    if (!formData.nationality.trim()) newErrors.nationality = '국적은 필수 입력 항목입니다.';
    
    setErrors(newErrors);
    
    // 에러가 있으면 제출 중단
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // 실제 저장 로직 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('개인정보가 수정되었습니다.');
    setHasChanges(false);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (window.confirm('수정사항이 있습니다. 정말 취소하시겠습니까?')) {
      setHasChanges(false);
      // 원래 데이터로 복원
    }
  };

  const measureTabWidth = (tabId, text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const width = context.measureText(text).width;
    setTabWidths(prev => ({ ...prev, [tabId]: width }));
  };

  useEffect(() => {
    measureTabWidth('basic', '기본정보');
    measureTabWidth('edit', '개인정보 수정');
  }, []);

  // 서명 캔버스 크기 조정
  useEffect(() => {
    if (showSignatureModal && signatureRef.current) {
      const canvas = signatureRef.current.getCanvas();
      const container = canvas.parentElement;
      
      // 컨테이너 크기에 맞춰 캔버스 크기 조정
      const containerWidth = container.clientWidth - 40; // 패딩 고려
      const containerHeight = 300;
      
      // 캔버스 크기 설정
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      // CSS 크기 설정
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      
      // SignatureCanvas 리사이즈
      signatureRef.current.fromDataURL(signatureRef.current.toDataURL());
    }
  }, [showSignatureModal]);

  return (
    <div className="mypage-container">
      <div className="page-header">
        <h1>마이페이지</h1>
        <p>개인정보를 확인하고 수정할 수 있습니다.</p>
      </div>

      <div className="profile-card">
        {/* 프로필 사진 섹션 */}
        <div className="photo-section">
          <div className="photo-container">
            {formData.photo ? (
              <img src={formData.photo} alt="프로필" className="profile-photo" />
            ) : (
              <div className="photo-placeholder">
                <span>📷</span>
                <p>사진 없음</p>
              </div>
            )}
          </div>
          <div className="photo-actions">
            <label className="photo-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              사진 변경
            </label>
            {formData.photo && (
              <button
                type="button"
                className="photo-reset-btn"
                onClick={resetPhoto}
              >
                기본 프로필로
              </button>
            )}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
            style={activeTab === 'basic' && tabWidths.basic ? {
              '--underline-width': `${tabWidths.basic}px`
            } : {}}
          >
            <span className="tab-title">기본정보</span>
            <span className="tab-subtitle">(조회 전용)</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
            style={activeTab === 'edit' && tabWidths.edit ? {
              '--underline-width': `${tabWidths.edit}px`
            } : {}}
          >
            <span className="tab-title">개인정보 수정</span>
            <span className="tab-subtitle">(전자서명)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            {/* 조회 전용 필드들 */}
            <div className={`readonly-section ${activeTab === 'basic' ? 'active' : ''}`}>
              <h3>기본 정보 (조회 전용)</h3>
              <div className="readonly-fields">
                <div className="field-group">
                  <label>회사코드</label>
                  <div className="readonly-field">{readOnlyData.companyCode}</div>
                </div>
                <div className="field-group">
                  <label>사용자ID</label>
                  <div className="readonly-field">{readOnlyData.userId}</div>
                </div>
                <div className="field-group">
                  <label>사원번호</label>
                  <div className="readonly-field">{readOnlyData.employeeNumber}</div>
                </div>
                <div className="field-group">
                  <label>사업장코드</label>
                  <div className="readonly-field">{readOnlyData.workplaceCode}</div>
                </div>
                <div className="field-group">
                  <label>직책</label>
                  <div className="readonly-field">{readOnlyData.position}</div>
                </div>
                <div className="field-group">
                  <label>부서</label>
                  <div className="readonly-field">{readOnlyData.department}</div>
                </div>
              </div>
            </div>

            {/* 수정 가능한 필드들 */}
            <div className={`editable-section ${activeTab === 'edit' ? 'active' : ''}`}>
              <h3>개인정보 수정</h3>
              <div className="editable-fields">
                <div className={`field-group ${touched.nickname && errors.nickname ? 'error' : ''}`}>
                  <label htmlFor="nickname">
                    <span className="req">*</span> 사용자명 (별명)
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, nickname: true }))}
                    className="editable"
                    aria-invalid={touched.nickname && errors.nickname}
                    aria-describedby="nicknameHelp"
                  />
                  {touched.nickname && errors.nickname && (
                    <p id="nicknameHelp" className="help error-text">
                      {errors.nickname}
                    </p>
                  )}
                </div>

                <div className={`field-group ${touched.phoneNumber && errors.phoneNumber ? 'error' : ''}`}>
                  <label htmlFor="phoneNumber">
                    <span className="req">*</span> 전화번호
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, phoneNumber: true }))}
                    className="editable"
                    placeholder="010-1234-5678"
                    aria-invalid={touched.phoneNumber && errors.phoneNumber}
                    aria-describedby="phoneNumberHelp"
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <p id="phoneNumberHelp" className="help error-text">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className={`field-group ${touched.birthDate && errors.birthDate ? 'error' : ''}`}>
                  <label htmlFor="birthDate">
                    <span className="req">*</span> 생년월일
                  </label>
                  <input
                    id="birthDate"
                    type="text"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, birthDate: true }))}
                    className="editable"
                    placeholder="YYYYMMDD"
                    maxLength="8"
                    aria-invalid={touched.birthDate && errors.birthDate}
                    aria-describedby="birthDateHelp"
                  />
                  {touched.birthDate && errors.birthDate && (
                    <p id="birthDateHelp" className="help error-text">
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div className={`field-group ${touched.nationality && errors.nationality ? 'error' : ''}`}>
                  <label htmlFor="nationality">
                    <span className="req">*</span> 국적
                  </label>
                  <input
                    id="nationality"
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, nationality: true }))}
                    className="editable"
                    aria-invalid={touched.nationality && errors.nationality}
                    aria-describedby="nationalityHelp"
                  />
                  {touched.nationality && errors.nationality && (
                    <p id="nationalityHelp" className="help error-text">
                      {errors.nationality}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 서명 섹션 */}
          <div className={`signature-section ${activeTab === 'edit' ? 'active' : ''}`}>
            <h3>전자서명</h3>
            <div className="signature-container">
              {signatureData ? (
                <div className="signature-preview">
                  <img src={signatureData} alt="서명 미리보기" className="signature-image" />
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => {
                      setSignatureData(null);
                      setHasChanges(true);
                    }}
                  >
                    서명 삭제
                  </button>
                </div>
              ) : (
                <div className="signature-placeholder">
                  <p>전자서명이 필요합니다</p>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={openSignatureModal}
                  >
                    전자서명하러 가기
                  </button>
                </div>
              )}
            </div>
          </div>

        </form>
      </div>

      {/* 하단 고정 버튼 */}
      {hasChanges && (
        <div className="fixed-bottom-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      )}

      {/* 서명 모달 */}
      {showSignatureModal && (
        <div className="signature-modal-overlay">
          <div className="signature-modal">
            <div className="signature-modal-header">
              <h3>전자서명</h3>
              <button
                type="button"
                className="close-btn"
                onClick={closeSignatureModal}
              >
                ✕
              </button>
            </div>
            <div className="signature-modal-body">
              <div className="signature-canvas-container">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'signature-canvas'
                  }}
                  backgroundColor="rgb(255, 255, 255)"
                  penColor="rgb(0, 0, 0)"
                  minWidth={1}
                  maxWidth={3}
                />
              </div>
              <div className="signature-modal-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={clearSignature}
                >
                  지우기
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={closeSignatureModal}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={saveSignature}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
