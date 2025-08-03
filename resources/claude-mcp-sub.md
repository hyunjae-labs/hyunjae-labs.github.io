
# MCP (Model Context Protocol) 설치 및 설정 가이드

## 핵심 원칙

**정확성 우선**: 모든 설치 단계를 검증하고, 가정하지 말고 확인하라
**환경 인식**: 사용자의 OS와 환경을 정확히 파악한 후 진행하라
**공식 문서 우선**: WebSearch로 공식 사이트를 확인한 후 설치하라

---

## 1. 사전 준비

### 환경 확인 체크리스트
```bash
# Node.js 버전 확인 (v18 이상 필요)
node --version

# npm 전역 설치 경로 확인
npm config get prefix

# 현재 OS 및 환경 확인
uname -a  # Linux/macOS
echo $OS  # Windows
```

### 필수 사항
- Node.js v18 이상
- 적절한 PATH 설정
- 관리자 권한 (필요시)

---

## 2. 설치 워크플로우

### 단계 1: 공식 문서 확인
1. WebSearch로 해당 MCP의 공식 사이트 확인
2. 현재 환경에 맞는 설치 방법 식별
3. context7 MCP 존재 시 추가 확인

### 단계 2: mcp-installer 사용
```bash
# 기본 설치 방법
mcp-installer install [MCP_NAME]
```

### 단계 3: 검증 프로세스
```bash
# 설치 목록 확인
claude mcp list

# 디버그 모드로 작동 확인
claude --debug

# MCP 작동 테스트 (최대 2분 관찰)
echo "/mcp" | claude --debug
```

---

## 3. 환경별 설정

### 설정 파일 위치
**Linux/macOS/WSL**
- User 설정: `~/.claude/`
- Project 설정: `프로젝트루트/.claude`

**Windows 네이티브**
- User 설정: `C:\Users\{사용자명}\.claude`
- User 설정파일: `C:\Users\{사용자명}\.claude.json`
- Project 설정: `프로젝트루트\.claude`

### 설정 예시

#### NPX 사용 (권장)
```json
{
  "youtube-mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "youtube-data-mcp-server"],
    "env": {
      "YOUTUBE_API_KEY": "YOUR_API_KEY_HERE",
      "YOUTUBE_TRANSCRIPT_LANG": "ko"
    }
  }
}
```

#### Windows CMD 래퍼
```json
{
  "mcpServers": {
    "mcp-installer": {
      "command": "cmd.exe",
      "args": ["/c", "npx", "-y", "@anaisbetts/mcp-installer"],
      "type": "stdio"
    }
  }
}
```

#### PowerShell 사용
```json
{
  "command": "powershell.exe",
  "args": [
    "-NoLogo", "-NoProfile",
    "-Command", "npx -y @anaisbetts/mcp-installer"
  ]
}
```

---

## 4. 트러블슈팅

### 일반적인 문제 해결

#### uvx 명령어를 찾을 수 없는 경우
```bash
# uv 설치 (Python 패키지 관리자)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### npm/npx 패키지를 찾을 수 없는 경우
```bash
# npm 전역 설치 경로 확인
npm config get prefix

# 직접 설치
npm install -g [PACKAGE_NAME]
```

### Claude 명령어 사용법

#### User 스코프 MCP 추가
```bash
claude mcp add --scope user youtube-mcp \
  -e YOUTUBE_API_KEY=$YOUR_YT_API_KEY \
  -e YOUTUBE_TRANSCRIPT_LANG=ko \
  -- npx -y youtube-data-mcp-server
```

#### JSON 형태로 MCP 추가
```bash
claude mcp add-json context7 -s user \
  '{"type":"stdio","command":"cmd","args": ["/c", "npx", "-y", "@upstash/context7-mcp@latest"]}'
```

#### MCP 제거
```bash
claude mcp remove [MCP_NAME]
```

---

## 5. 중요 주의사항

### 설정 시 고려사항
- **API 키**: 가상 키로 초기 설정 후 실제 키 입력 안내
- **서버 의존성**: MySQL MCP 등은 관련 서버 구동 상태 확인 필요
- **권한 관리**: WSL sudo 패스워드 사전 확인
- **경로 처리**: Windows에서 JSON 내 백슬래시는 이스케이프 처리 (`\\`) 필요

### args 배열 설계 체크리스트
- 토큰 단위로 분리: `["args1", "args2"]`
- 경로 포함 시: JSON에서 `\\` 사용
- 환경변수 전달: `"env"` 객체 활용
- 타임아웃 조정: `MCP_TIMEOUT` 환경변수 설정

### 검증 필수 사항
1. `claude mcp list`로 설치 확인
2. `claude --debug`로 디버그 모드 실행 (최대 2분 관찰)
3. `/mcp` 명령어로 실제 작동 확인
4. 에러 발생 시 디버그 메시지 분석

---

## 6. 환경별 특수 설정

### WSL 환경
- sudo 패스워드: `qsc1445!`
- Linux 경로 규칙 적용

### Windows 네이티브
- 경로 구분자: 백슬래시 (`\`)
- JSON 내 이스케이프 처리 필수: `\\`
- CMD 또는 PowerShell 래퍼 활용

### 공통 최적화
- `npx -y` 옵션으로 호환성 향상
- `MCP_TIMEOUT` 환경변수로 부팅 시간 조정
- 느린 PC의 경우 타임아웃 값 증가 권장 (예: 10000ms)