# 파일 접근 및 분석 방법

## 직접 파일 접근
- **Read 도구 사용**: 로컬 파일시스템에 직접 접근 가능
- **경로**: `/Users/hyunjaelim/01-projects/hyunjae-blog/content/`
- **WebFetch 불필요**: 로컬 파일은 Read 도구로 즉시 접근

## Hugo 파일 구조
- **Section Pages**: `_index.md` (섹션 랜딩 페이지 + 리스트)
- **Single Pages**: `index.md` (단일 페이지)
- **Content Structure**: content/{section}/_index.md or {page}.md

## 파일 작업 규칙
- **Read tool 먼저**: Write나 Edit 전에 반드시 Read로 내용 확인
- **절대 경로 사용**: 상대 경로 금지, 경로 순회 공격 방지
- **배치 작업 선호**: 가능한 한 배치 작업으로 효율성 향상
- **트랜잭션적 동작**: 실패 시 원복 가능한 구조