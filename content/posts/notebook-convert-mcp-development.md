---
title: "notebook-convert-mcp 개발기: Jupyter 노트북 메타데이터 문제 해결하기"
date: 2024-12-28
draft: false
tags: ["MCP", "Claude", "AI", "개발도구", "Jupyter", "Markdown", "NPM"]
categories: ["AI", "개발"]
summary: "Jupyter Notebook의 메타데이터 문제를 해결하기 위해 MCP 서버를 개발한 과정이다. AI 분석용 변환 도구를 만들고 NPM으로 배포한 경험을 기록한다."
---

## 문제 발견: AI가 읽기 어려운 Jupyter Notebook

나는 평소 Jupyter Notebook으로 데이터 분석 작업을 자주 하는데, AI에게 노트북 내용을 분석해달라고 할 때 항상 문제가 있었다. 

### 발견한 문제
`.ipynb` 파일은 **엄청난 메타데이터**를 숨기고 있다:

**예시 - 단순한 print 코드의 실제 저장 형태**:
```json
{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "outputs": [{"name": "stdout", "text": ["Hello World\n"]}],
   "source": ["print('Hello World')"]
  }
 ],
 "metadata": {
  "kernelspec": {"display_name": "Python 3"},
  "language_info": {"name": "python"}
 }
}
```

**문제점**:
- 코드 블록 몇 개 없어도 파일 크기가 엄청남  
- **이미지가 포함되면 수백 줄 넘어감** (base64 인코딩)
- AI가 읽을 때 **과부하** 발생
- 핵심 코드보다 메타데이터가 더 많음

### 해결 방향
**"AI가 읽기 편한 상태로 만들고, 필요할 때 다시 노트북으로 변환하면 되지 않을까?"**

이 고민에서 출발해서:
1. `ipynb` → `md` (AI 분석용, 메타데이터 제거)
2. `md` → `ipynb` (실행용, 다시 변환)

이런 양방향 변환 시스템을 만들기로 했다.

### NPM 배포 이유
**"git clone 없이 한 줄로 설치할 수 있게 하자"**

기존 도구들은 대부분 git clone 후 수동 설정이 필요했다:
- 매번 저장소 클론 필요
- 의존성 수동 설치  
- 업데이트 확인 번거로움
- MCP 서버 등록 복잡

`npx notebook-convert-mcp install` 한 줄로 모든 것이 해결되도록 하고 싶었다.

---

## 개발 과정

### MCP 서버 구조

MCP 서버는 크게 두 가지 함수를 구현해야 한다:

```python
@server.list_tools()
async def list_tools() -> list[types.Tool]:
    """사용 가능한 도구 목록을 반환"""
    return [
        types.Tool(name="convert_notebook", description="..."),
        types.Tool(name="convert_markdown", description="...")
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.Content]:
    """실제 도구를 실행"""
    # 변환 로직 실행
```

### 핵심 변환 로직

가장 중요한 부분은 실제 변환 로직이었다:

**핵심 아이디어**:
- Notebook → Markdown: 실행 결과와 메타데이터 제거, 순수한 코드와 마크다운만 추출
- Markdown → Notebook: 정규표현식으로 코드 블록 감지하여 실행 가능한 셀로 변환

---

## 시행착오와 해결 과정

### 1. 파일명 규칙 문제

처음에는 `mcp-server.py`로 파일명을 지었는데, Python 관례에 맞춰 언더바로 변경했다.

```bash
# 파일명 변경
mv mcp-server.py mcp_server.py

# package.json도 함께 업데이트  
"main": "mcp_server.py"
```

### 2. NPX 설치 스크립트 문제

`npx notebook-convert-mcp --version`을 실행했는데 설치 스크립트가 실행되는 문제가 있었다.

**원인**: `package.json`의 `bin` 필드가 설치 스크립트를 가리키고 있어서 모든 명령어가 설치로 연결됨

**해결**: `install.js`에 명령어 인자 처리 로직 추가하여 `--version`, `--help` 같은 명령어를 구분

### 3. Claude Code CLI vs Claude Desktop 설정

처음에는 설치 스크립트가 Claude Desktop 경로를 가리키고 있어서 Claude Code CLI에서 인식되지 않는 문제가 있었다:

- **Claude Desktop**: `~/.config/claude-code/claude_desktop_config.json`
- **Claude Code CLI**: `~/.claude.json`

설치 스크립트가 올바른 경로(`~/.claude.json`)와 정확한 설정 구조(`mcpServers` 객체)를 사용하도록 수정했다:

```bash
claude mcp add --scope user notebook-convert-mcp -- python3 /path/to/mcp_server.py
```

---

## 개발 결과

### NPM 배포 성과

**목표 달성**:
- `npx notebook-convert-mcp install` 한 줄로 설치 완료
- Python 의존성 자동 설치
- MCP 서버 자동 등록
- git clone 불필요

**실제 테스트**:
```json
{
  "status": "success",
  "output_path": "/path/to/converted_file.md"  
}
```

완벽하게 작동했고, 양방향 변환도 성공적으로 이루어졌다.

---

## 배운 점들

### 1. 사용자 편의성의 중요성

`git clone` 대신 `npx` 한 줄로 설치할 수 있게 만든 것이 큰 차이를 만들었다. 기술적 완성도보다 사용 편의성이 더 중요할 때가 있다.

### 2. Python과 NPM 생태계 연결

Python 라이브러리를 NPM으로 배포하는 것이 가능하다는 점이 흥미로웠다. `install.js`가 Python 의존성 설치와 MCP 서버 등록을 모두 처리하는 구조였다.

### 3. 메타데이터 제거의 효과

단순해 보이는 기능이지만 실제로 사용하니 AI 분석 품질이 크게 개선되었다. 노트북의 노이즈가 제거되니 AI가 핵심 내용에 집중할 수 있게 되었다.

---

## 개선 계획

현재 기본 기능은 완성되었지만 추가할 수 있는 기능들:

- **배치 변환 기능**: 폴더 단위 일괄 변환
- **메타데이터 보존 옵션**: 필요시 메타데이터 유지
- **다른 변환 형식**: PDF, HTML 등 지원

---

**결론**: Jupyter Notebook의 메타데이터 문제를 해결하기 위해 시작한 프로젝트가 NPM 배포까지 이어졌다. 기술적 완성도만큼이나 사용자 편의성이 중요하다는 것을 배웠다.

**관련 프로젝트**: [notebook-convert-mcp](/projects/#notebook-convert-mcp)