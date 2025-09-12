import React from "react";
import "./FilterPage.css";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

// ===== 샘플 데이터 =====
const ROWS = [
  { no: 1, 본부: "지원선배님 본부", 부서: "지원선배님 부서", 팀: "멋쟁이팀", 파트: "CI/CD 파트", 권한: "근로자", 직위: "과장", 성명: "재윤", id: "jy_em", 사번: "TEST_Z" },
  { no: 2, 본부: "지원선배님 본부", 부서: "지원선배님 부서", 팀: "멋쟁이팀", 파트: "CI/CD 파트", 권한: "근로자", 직위: "과장", 성명: "재윤", id: "jy_em", 사번: "TEST_Z" },
  { no: 3, 본부: "지원선배님 본부", 부서: "지원선배님 부서", 팀: "멋쟁이팀", 파트: "CI/CD 파트", 권한: "근로자", 직위: "과장", 성명: "재윤", id: "jy_em", 사번: "TEST_Z" },
];

// 유니크 옵션
const unique = (arr, key) =>
  [...new Set(arr.map((r) => (r[key] ?? "").toString()))].filter(Boolean);

// 표 컬럼
const COLUMNS = ["NO", "본부", "부서", "팀", "파트", "권한", "직위", "성명", "ID", "사번"];

// 공백/대소문자 무시한 정확 일치 비교
const eq = (a, b) =>
  (a ?? "").toString().trim().toLowerCase() === (b ?? "").toString().trim().toLowerCase();

// Chip 표시 순서/라벨
const FILTER_KEYS = ["본부", "부서", "팀", "파트", "권한", "직위", "성명", "id", "사번"];
const LABEL = { 본부: "본부", 부서: "부서", 팀: "팀", 파트: "파트", 권한: "권한", 직위: "직위", 성명: "성명", id: "ID", 사번: "사번" };

export default function FilterPage() {
  // 실제 적용된 필터
  const [filters, setFilters] = React.useState({
    본부: "", 부서: "", 팀: "", 파트: "", 권한: "", 직위: "", 성명: "", id: "", 사번: "",
  });

  // 팝업(draft)
  const [draft, setDraft] = React.useState(filters);
  const [open, setOpen] = React.useState(false);

  // 드롭다운 선택지
  const options = React.useMemo(
    () => ({
      본부: unique(ROWS, "본부"),
      부서: unique(ROWS, "부서"),
      팀: unique(ROWS, "팀"),
      파트: unique(ROWS, "파트"),
      권한: unique(ROWS, "권한"),
      직위: unique(ROWS, "직위"),
      성명: unique(ROWS, "성명"),
      id: unique(ROWS, "id"),
      사번: unique(ROWS, "사번"),
    }),
    []
  );

  // 필터 적용된 목록
  const filteredRows = React.useMemo(() => {
    return ROWS.filter((r) => {
      for (const k of FILTER_KEYS) {
        if (filters[k] && !eq(r[k], filters[k])) return false;
      }
      return true;
    });
  }, [filters]);

  // 팝업 열기/닫기
  const handleOpen = () => { setDraft(filters); setOpen(true); };
  const handleClose = () => setOpen(false);

  // 적용하기: draft -> filters
  const applyFilters = () => { setFilters(draft); setOpen(false); };

  // Chip 제어
  const clearOne = (key) => setFilters((f) => ({ ...f, [key]: "" }));
  const clearAll = () =>
    setFilters({ 본부: "", 부서: "", 팀: "", 파트: "", 권한: "", 직위: "", 성명: "", id: "", 사번: "" });

  const activeEntries = FILTER_KEYS
    .map((k) => [k, filters[k]])
    .filter(([, v]) => v && v.toString().trim() !== "");

  return (
    <Container maxWidth="lg" className="filterContainer">
      {/* 타이틀 + 버튼 */}
      <Box className="filterHeader">
        <Typography variant="h4" fontWeight="bold">사용자정보</Typography>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleOpen}
          className="topBtn"
        >
          표 정렬하기
        </Button>
      </Box>

      {/* 적용된 필터 Chip */}
      <Box className="chipRow">
        {activeEntries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">적용된 필터 없음</Typography>
        ) : (
          <>
            {activeEntries.map(([k, v]) => (
              <Chip
                key={k}
                label={`${LABEL[k]}: ${v}`}
                onDelete={() => clearOne(k)}
                className="chip"
              />
            ))}
            <Button size="small" onClick={clearAll}>모두 해제</Button>
          </>
        )}
      </Box>

      {/* 결과 테이블 */}
      <Paper elevation={3} className="resultPaper">
        <Box className="resultHeader">
          <Typography variant="h6">검색 결과 ({filteredRows.length}건)</Typography>
          <Box className="resultActions">
            <Button variant="outlined">엑셀로 내보내기</Button>
          </Box>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell key={col} className="thBold">{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} align="center" className="noRows">
                    조건에 맞는 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow key={row.no} hover>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.본부}</TableCell>
                    <TableCell>{row.부서}</TableCell>
                    <TableCell>{row.팀}</TableCell>
                    <TableCell>{row.파트}</TableCell>
                    <TableCell>{row.권한}</TableCell>
                    <TableCell>{row.직위}</TableCell>
                    <TableCell>{row.성명}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.사번}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ===== 필터 팝업(Dialog) ===== */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialogTitle">
          컬럼별 필터
          <IconButton onClick={handleClose} aria-label="닫기"><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Box className="dialogGrid">
              {["본부", "부서", "팀", "파트", "권한", "직위", "성명", "id", "사번"].map((key) => (
                <FormControl fullWidth key={key}>
                  <InputLabel>{LABEL[key]}</InputLabel>
                  <Select
                    value={draft[key] ?? ""}
                    label={LABEL[key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  >
                    <MenuItem value="">(전체)</MenuItem>
                    {options[key].map((v) => (
                      <MenuItem key={v} value={v}>{v}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions className="dialogActions">
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setDraft({ 본부: "", 부서: "", 팀: "", 파트: "", 권한: "", 직위: "", 성명: "", id: "", 사번: "" })}
          >
            팝업값 초기화
          </Button>
          <Button variant="contained" onClick={applyFilters} className="applyBtn">
            적용하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
