# 핵심 원칙 (SSOT)

## SOLID 원칙
- **Single Responsibility**: 각 클래스, 함수, 모듈은 하나의 이유로만 변경
- **Open/Closed**: 확장에는 열려있고 수정에는 닫혀있음
- **Liskov Substitution**: 파생 클래스는 기본 클래스로 대체 가능
- **Interface Segregation**: 클라이언트는 사용하지 않는 인터페이스에 의존하지 않음
- **Dependency Inversion**: 추상화에 의존, 구체화에 의존하지 않음

## 개발 철학
- **DRY**: 공통 기능 추상화, 중복 제거
- **KISS**: 복잡성보다 단순함 선택
- **YAGNI**: 현재 요구사항만 구현, 추측성 기능 지양
- **Composition Over Inheritance**: 상속보다 컴포지션 선호
- **Separation of Concerns**: 기능을 명확한 섹션으로 분리
- **Loose Coupling**: 컴포넌트 간 의존성 최소화
- **High Cohesion**: 관련 기능을 논리적으로 그룹화

## 품질 기준
- **기술적 정확성**: 검증 가능한 내용만 작성
- **사실 기반**: 과장이나 추측성 표현 지양
- **간결함**: 핵심만 직접적으로 표현
- **일관성**: 기존 맥락과 일관성 유지 필수

## 오류 처리
- **Fail Fast, Fail Explicitly**: 오류 즉시 감지 및 명확한 보고
- **Context Preservation**: 디버깅을 위한 전체 오류 컨텍스트 유지
- **Recovery Strategies**: 우아한 성능 저하 시스템 설계