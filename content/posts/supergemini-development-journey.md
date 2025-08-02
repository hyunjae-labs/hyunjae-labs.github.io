+++
date = '2025-08-03T07:27:30+09:00'
draft = false
title = 'SuperGemini 개발 일지: SuperClaude 아키텍처 분석과 포팅'
description = 'LLM 평가 시스템을 만들던 중 SuperClaude를 발견하고 Gemini용으로 포팅한 과정'
tags = ['개발일지', 'SuperGemini', 'LLM', '프롬프트평가', 'MCP', 'OpenSource']
categories = ['프로젝트']
+++

## 배경: LLM 평가에 대한 관심

나는 평소 LLM과 프롬프트 평가에 관심이 많아서 **자체 LLM 평가 시스템**을 개발해 사용하고 있었다. 이 시스템은 Claude의 서로 다른 프롬프트 전략을 자동으로 비교 평가하는 도구로, Promptfoo 프레임워크를 기반으로 한다:

**평가 데이터 소스**:
- **학습 데이터 이후 문제**: Codeforces Round 1036/1037 (2025년 7월), AtCoder World Tour Finals (2025년 7월) 등 Claude 학습 컷오프 이후 출제된 문제들
- **다영역 벤치마크**: 알고리즘 구현, 시스템 설계, 논리 추론, 데이터 분석 등 실무 중심 문제

**평가 방식**:
- **자동 코드 검증**: Python 실행으로 정답률 측정 (테스트 케이스 자동 실행)
- **LLM 기반 채점**: OpenAI GPT가 응답 품질을 1-10점으로 상세 평가
- **객관적 기준**: 사전 정의된 채점 루브릭으로 편향 최소화

이 시스템을 통해 프롬프트 성능을 객관적으로 측정하고 개선하는 것이 매우 흥미로웠다.

---

## SuperClaude 발견

그러던 중 **SuperClaude**라는 참신한 시스템을 알게 되었다. Claude CLI를 확장하여 전문화된 명령어와 페르소나 시스템을 제공하는 프레임워크였다. 이 아키텍처가 정말 인상적이었다:

- 17개의 전문 명령어 시스템
- 도메인별 페르소나 (architect, frontend, backend 등)
- MCP 서버 통합
- 체계적인 워크플로우 관리

## Gemini 버전의 필요성

나는 Gemini-CLI도 종종 사용하는데, 이런 시스템이 Gemini에는 없었다. **"Gemini에서도 이걸 사용할 수 있다면?"** 하는 생각이 들었다.

그래서 SuperClaude의 아키텍처를 분석하고 Gemini CLI에 맞게 적응시키기 시작했다.

---

## 개발 과정

### 1. 아키텍처 분석
SuperClaude의 구조를 파악하고 Gemini CLI의 차이점을 분석:
- Claude CLI: JSON 기반 설정
- Gemini CLI: TOML 기반 명령어 시스템

### 2. 핵심 기능 포팅
- 17개 명령어 시스템 (`/sg:` 접두사로 변경)
- 페르소나 시스템 완전 이식
- 플래그 시스템 호환성 확보

### 3. 호환성 문제 해결

**Thinking Budget System**: 
Claude의 `--think` 플래그는 Gemini API에서 작동하지 않아서 제거

**Magic MCP 호환성 문제**:
Gemini API 함수명 규칙과 충돌이 있어서 현재는 **비활성화** 상태로 설정:
```python
# setup.py에서 기본적으로 disabled
magic_mcp_enabled = False
```

필요시 사용자가 수동으로 활성화할 수 있도록 설정 옵션 제공.

---

## 오픈소스 배포

개발이 완료된 후, **혼자만 사용하기 아까운 시스템**이라는 생각이 들었다. 

### MIT License로 배포
- GitHub: [SuperGemini-Org/SuperGemini_Framework](https://github.com/SuperGemini-Org/SuperGemini_Framework)
- PyPI: `pip install SuperGemini`
- 원본 SuperClaude에 대한 적절한 attribution 포함

### 설치 및 사용
```bash
pip install SuperGemini
python -m SuperGemini install
```

## 현재 상태

**v3.1.2** 기준:
- ✅ 17개 명령어 완전 작동
- ✅ 페르소나 시스템 정상 동작
- ✅ Context7, Sequential, Playwright MCP 연동
- ⚠️ Magic MCP는 호환성 문제로 비활성화
- ✅ PyPI 배포 완료

---

## 배운 점

1. **오픈소스의 가치**: 좋은 아이디어는 다른 플랫폼으로도 확장될 수 있다
2. **API 차이점**: Claude와 Gemini의 함수명 규칙 차이가 생각보다 중요했다
3. **기술적 호환성**: 서로 다른 AI 플랫폼 간의 차이점을 이해하게 되었다

## 향후 계획

- Magic MCP 호환성 문제 해결
- 사용자 피드백 반영
- Gemini 특화 기능 추가 검토

---

**결론**: LLM 평가에 대한 개인적 관심이 의미있는 오픈소스 프로젝트로 발전했다. SuperClaude 팀에게 감사하며, Gemini 사용자들에게도 도움이 되길 바란다.
