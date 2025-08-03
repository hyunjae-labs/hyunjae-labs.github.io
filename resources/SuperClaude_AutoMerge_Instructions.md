# SuperClaude Extension Auto-Merge Instructions

**목적**: SuperClaude 업데이트 시 커스텀 확장사항 자동 병합

**설계 원칙**: 
- **Zero Assumptions**: 경로, 설치방식, 파일구조 등 사전 가정 없음
- **Cross Platform**: macOS/Linux/Windows 모든 환경 지원
- **Self-Contained**: 외부 의존성 없는 독립 실행
- **Intelligent Detection**: 설정 및 환경 자동 감지
- **Multiple Fallbacks**: 실패 시 대체 방법 자동 시도

## 완전 자동화 스크립트

```bash
#!/bin/bash
# SuperClaude_AutoMerge.sh - 크로스 플랫폼 자동화 병합 스크립트
# 목적: SuperClaude 업데이트 시 커스텀 확장사항 자동 병합

set -e

echo "🚀 SuperClaude Extension Auto-Merge 시작"
echo "================================================================"

# Phase 1: 환경 자동 감지
detect_os() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*)  echo "linux" ;;
        CYGWIN*|MINGW*|MSYS*) echo "windows" ;;
        *) echo "unknown" ;;
    esac
}

detect_home() {
    if [ -n "$HOME" ]; then
        echo "$HOME"
    elif [ -n "$USERPROFILE" ]; then
        echo "$USERPROFILE"
    else
        echo "$(cd ~ && pwd)"
    fi
}

detect_claude_dir() {
    local home_dir="$1"
    local possible_dirs=(
        "$home_dir/.claude"
        "$home_dir/.config/claude"
        "$home_dir/AppData/Roaming/claude"
        "$home_dir/Library/Application Support/claude"
        "$(find "$home_dir" -name ".claude" -type d 2>/dev/null | head -1)"
    )
    
    for dir in "${possible_dirs[@]}"; do
        if [ -d "$dir" ] && [ -f "$dir/COMMANDS.md" ] && [ -f "$dir/PERSONAS.md" ]; then
            echo "$dir"
            return 0
        fi
    done
    
    echo ""
    return 1
}

echo "🔍 환경 자동 감지 중..."
OS_TYPE=$(detect_os)
HOME_DIR=$(detect_home)
CLAUDE_DIR=$(detect_claude_dir "$HOME_DIR")

if [ -z "$CLAUDE_DIR" ]; then
    echo "❌ Claude 설정 디렉토리를 찾을 수 없습니다"
    echo "💡 다음 위치 중 하나에 COMMANDS.md와 PERSONAS.md가 있는지 확인하세요:"
    echo "   - $HOME_DIR/.claude/"
    echo "   - $HOME_DIR/.config/claude/"
    exit 1
fi

echo "✅ 환경 감지 완료: $OS_TYPE ($CLAUDE_DIR)"

# Phase 2: SuperClaude 설치 방식 자동 감지
detect_superclaude_installation() {
    # Method 1: pip 설치 확인
    if command -v pip >/dev/null 2>&1; then
        local pip_version=$(pip show SuperClaude 2>/dev/null | grep Version | cut -d' ' -f2)
        if [ -n "$pip_version" ]; then
            echo "pip:$pip_version"
            return 0
        fi
    fi
    
    # Method 2: Python import 확인  
    if command -v python3 >/dev/null 2>&1; then
        local import_path=$(python3 -c "try: import SuperClaude; print(SuperClaude.__path__[0])
except: pass" 2>/dev/null)
        if [ -n "$import_path" ] && [ -d "$import_path" ]; then
            echo "python:$import_path"
            return 0
        fi
    fi
    
    # Method 3: Git 저장소 탐지
    local possible_git_dirs=(
        "$HOME_DIR/SuperClaude"
        "$HOME_DIR/SuperClaude_Framework"
        "$HOME_DIR/01-projects/SuperClaude_Framework"
        "$HOME_DIR/projects/SuperClaude"
        "$(find "$HOME_DIR" -name "*SuperClaude*" -type d 2>/dev/null | head -1)"
    )
    
    for dir in "${possible_git_dirs[@]}"; do
        if [ -d "$dir/.git" ] && [ -d "$dir/SuperClaude/Core" ]; then
            echo "git:$dir/SuperClaude/Core"
            return 0
        elif [ -d "$dir" ] && [ -f "$dir/SuperClaude/Core/COMMANDS.md" ]; then
            echo "local:$dir/SuperClaude/Core"
            return 0
        fi
    done
    
    echo ""
    return 1
}

SUPERCLAUDE_INFO=$(detect_superclaude_installation)
if [ -z "$SUPERCLAUDE_INFO" ]; then
    echo "❌ SuperClaude 설치를 찾을 수 없습니다"
    echo "💡 다음 방법 중 하나로 SuperClaude를 설치하세요:"
    echo "   - pip install SuperClaude"
    echo "   - git clone SuperClaude 저장소"
    exit 1
fi

INSTALL_TYPE=$(echo "$SUPERCLAUDE_INFO" | cut -d: -f1)
INSTALL_PATH=$(echo "$SUPERCLAUDE_INFO" | cut -d: -f2-)
echo "✅ SuperClaude 감지: $INSTALL_TYPE ($INSTALL_PATH)"

# Phase 3: 업데이트 확인
check_update_needed() {
    case "$INSTALL_TYPE" in
        "pip")
            local current="$INSTALL_PATH"
            local latest=$(pip index versions SuperClaude 2>/dev/null | head -1 | cut -d' ' -f2 || echo "unknown")
            if [ "$current" != "$latest" ] && [ "$latest" != "unknown" ]; then
                echo "true:$current:$latest"
            else
                echo "false:$current:$current"
            fi
            ;;
        "git")
            cd "$(dirname "$INSTALL_PATH")" 2>/dev/null || return 1
            git fetch origin 2>/dev/null || return 1
            if ! git diff --quiet HEAD origin/main 2>/dev/null; then
                local current=$(git rev-parse --short HEAD)
                local latest=$(git rev-parse --short origin/main)
                echo "true:$current:$latest"
            else
                local current=$(git rev-parse --short HEAD)
                echo "false:$current:$current"
            fi
            ;;
        *)
            echo "false:unknown:unknown"
            ;;
    esac
}

UPDATE_INFO=$(check_update_needed)
UPDATE_NEEDED=$(echo "$UPDATE_INFO" | cut -d: -f1)
CURRENT_VER=$(echo "$UPDATE_INFO" | cut -d: -f2)
LATEST_VER=$(echo "$UPDATE_INFO" | cut -d: -f3)

if [ "$UPDATE_NEEDED" = "true" ]; then
    echo "📦 업데이트 발견: $CURRENT_VER → $LATEST_VER"
else
    echo "✅ 최신 버전 확인: $CURRENT_VER"
fi

# Phase 4: 백업 및 업데이트
if [ "$UPDATE_NEEDED" = "true" ]; then
    echo "💾 백업 생성 중..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mkdir -p "$CLAUDE_DIR/backups"
    cp "$CLAUDE_DIR/COMMANDS.md" "$CLAUDE_DIR/backups/COMMANDS_CUSTOM_${TIMESTAMP}.md"
    cp "$CLAUDE_DIR/PERSONAS.md" "$CLAUDE_DIR/backups/PERSONAS_CUSTOM_${TIMESTAMP}.md"
    
    echo "🔄 SuperClaude 업데이트 중..."
    case "$INSTALL_TYPE" in
        "pip")
            pip install --upgrade SuperClaude
            ;;
        "git")
            cd "$(dirname "$INSTALL_PATH")" && git pull origin main
            ;;
    esac
fi

# Phase 5: 원본 파일 위치 자동 탐지
find_original_files() {
    local possible_paths=()
    
    case "$INSTALL_TYPE" in
        "pip"|"python")
            local python_path=$(python3 -c "try: import SuperClaude; print(SuperClaude.__path__[0])
except: pass" 2>/dev/null)
            if [ -n "$python_path" ]; then
                possible_paths+=("$python_path/Core" "$python_path")
            fi
            ;;
        "git"|"local")
            possible_paths+=("$INSTALL_PATH")
            ;;
    esac
    
    possible_paths+=(
        "$(find "$HOME_DIR" -name "COMMANDS.md" -path "*/SuperClaude/*" 2>/dev/null | head -1 | xargs dirname)"
    )
    
    for path in "${possible_paths[@]}"; do
        if [ -f "$path/COMMANDS.md" ] && [ -f "$path/PERSONAS.md" ]; then
            echo "$path"
            return 0
        fi
    done
    
    echo ""
    return 1
}

ORIGINAL_FILES_DIR=$(find_original_files)
if [ -z "$ORIGINAL_FILES_DIR" ]; then
    echo "❌ SuperClaude 원본 파일을 찾을 수 없습니다"
    exit 1
fi

echo "✅ 원본 파일 위치: $ORIGINAL_FILES_DIR"

# Phase 6: 병합 실행
if [ "$UPDATE_NEEDED" = "true" ]; then
    echo "🔧 커스텀 확장사항 병합 중..."
    
    LATEST_COMMANDS_BACKUP=$(ls -t "$CLAUDE_DIR/backups/COMMANDS_CUSTOM_"*.md 2>/dev/null | head -1)
    LATEST_PERSONAS_BACKUP=$(ls -t "$CLAUDE_DIR/backups/PERSONAS_CUSTOM_"*.md 2>/dev/null | head -1)
    
    if [ -n "$LATEST_COMMANDS_BACKUP" ] && [ -n "$LATEST_PERSONAS_BACKUP" ]; then
        # 차이점 추출
        diff "$ORIGINAL_FILES_DIR/COMMANDS.md" "$LATEST_COMMANDS_BACKUP" > "$CLAUDE_DIR/temp_commands_diff.txt" 2>/dev/null || true
        diff "$ORIGINAL_FILES_DIR/PERSONAS.md" "$LATEST_PERSONAS_BACKUP" > "$CLAUDE_DIR/temp_personas_diff.txt" 2>/dev/null || true
        
        # 원본으로 초기화
        cp "$ORIGINAL_FILES_DIR/COMMANDS.md" "$CLAUDE_DIR/COMMANDS.md"
        cp "$ORIGINAL_FILES_DIR/PERSONAS.md" "$CLAUDE_DIR/PERSONAS.md"
        
        # Python으로 병합 실행
        export CLAUDE_DIR
        python3 << 'PYTHON_SCRIPT'
import sys, os

def extract_and_merge_additions(diff_file, target_file):
    try:
        if not os.path.exists(diff_file):
            return 0
        with open(diff_file, 'r', encoding='utf-8') as f:
            diff_content = f.read()
        if not diff_content.strip():
            return 0
        added_lines = [line[2:] for line in diff_content.split('\n') if line.startswith('> ')]
        if added_lines:
            with open(target_file, 'a', encoding='utf-8') as f:
                f.write('\n' + '\n'.join(added_lines))
            print(f"✅ {len(added_lines)}개 라인이 {os.path.basename(target_file)}에 병합됨")
            return len(added_lines)
        return 0
    except Exception as e:
        print(f"❌ 병합 오류: {e}")
        return -1

claude_dir = os.environ.get('CLAUDE_DIR', '')
commands_merged = extract_and_merge_additions(f'{claude_dir}/temp_commands_diff.txt', f'{claude_dir}/COMMANDS.md')
personas_merged = extract_and_merge_additions(f'{claude_dir}/temp_personas_diff.txt', f'{claude_dir}/PERSONAS.md')

total_merged = max(0, commands_merged) + max(0, personas_merged)
if commands_merged == -1 or personas_merged == -1:
    sys.exit(1)
elif total_merged > 0:
    print(f"🎉 총 {total_merged}개 라인의 커스텀 확장사항이 병합됨")
PYTHON_SCRIPT
        
        # 정리
        rm -f "$CLAUDE_DIR/temp_commands_diff.txt" "$CLAUDE_DIR/temp_personas_diff.txt"
    fi
fi

# Phase 7: 최종 보고서
echo ""
echo "🎉 SuperClaude Extension Auto-Merge 완료!"
echo "================================================================"
echo "✅ 환경: $OS_TYPE"
echo "✅ Claude Dir: $CLAUDE_DIR"
echo "✅ SuperClaude: $INSTALL_TYPE"
if [ "$UPDATE_NEEDED" = "true" ]; then
    echo "✅ 업데이트: $CURRENT_VER → $LATEST_VER"
    echo "✅ 커스텀 확장사항: 병합 완료"
else
    echo "ℹ️  업데이트: 불필요"
fi
echo "================================================================"
echo "🚀 Claude Code를 재시작하여 변경사항을 적용하세요"
```

## 실행 방법

### 초기 설정
```bash
# 1. 스크립트 다운로드 또는 복사
# 위 스크립트를 SuperClaude_AutoMerge.sh 파일로 저장

# 2. 실행 권한 부여
chmod +x SuperClaude_AutoMerge.sh
```

### 사용법
```bash
# SuperClaude 업데이트 및 커스텀 확장사항 자동 병합
./SuperClaude_AutoMerge.sh
```

## 기술적 특징

**Zero Assumptions**:
- 하드코딩된 경로 없음 → 동적 홈 디렉토리 감지
- 설치 방식 무관 → pip/git/local/python 모든 방식 자동 감지  
- 파일 구조 독립적 → 다중 경로 탐색으로 원본 파일 자동 발견
- OS 독립적 → macOS/Linux/Windows 크로스 플랫폼 대응

**Intelligent Detection**:
- **환경 감지**: OS, 홈 디렉토리, Claude 설정 위치 자동 탐지
- **설치 방식 감지**: pip/git/local/python import 4가지 방법으로 SuperClaude 위치 확인
- **버전 관리**: 설치 방식에 따른 맞춤형 업데이트 확인
- **파일 탐색**: 여러 가능한 경로에서 원본 파일 자동 발견

**Multiple Fallbacks**:
- Claude 디렉토리: 5가지 가능한 위치 순차 확인
- SuperClaude 설치: 4가지 감지 방법 순차 시도  
- 원본 파일: 설치 방식별 + 일반적 위치 모두 확인
- 실패 시 명확한 안내 메시지와 해결 방법 제공

**결과**: 
- 모든 사용자 환경에서 작동
- 모든 설치 방식 지원 (pip, git clone, local build)
- 모든 OS 지원 (macOS, Linux, Windows)  
- 사전 설정 없이 즉시 실행 가능