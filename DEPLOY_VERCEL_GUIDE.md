# 🚀 GitHub 및 Vercel 원클릭 배포 가이드

본 앱은 **Vercel Serverless & Vite SPA 최적화 설정(`vercel.json`, `api/index.ts`)**이 이미 완벽히 완료되어 있어, GitHub에 올린 뒤 Vercel에서 가져오기만 하면 즉시 무료로 유포(배포)할 수 있습니다.

---

## 1단계: GitHub 저장소에 코드 올리기

터미널이나 Git 프로그램(GitHub Desktop, VSCode 등)에서 다음 명령어를 순서대로 실행합니다:

```bash
# 1. git 초기화 (아직 안 되어 있는 경우)
git init

# 2. 모든 파일 스테이징
git add .

# 3. 커밋 메시지 작성
git commit -m "feat: 1학년 5반 정보 기말고사 마스터 앱 배포 준비 완료"

# 4. 기본 브랜치를 main으로 설정
git branch -M main

# 5. 본인의 GitHub 새 저장소 주소(Remote) 연결 (본인 아이디/저장소명으로 변경)
git remote add origin https://github.com/본인아이디/저장소이름.git

# 6. GitHub로 푸시
git push -u origin main
```

---

## 2단계: Vercel에서 배포하기

1. **[Vercel 공식 웹사이트](https://vercel.com)** 에 접속하여 로그인합니다. (GitHub 계정으로 로그인 권장)
2. 대시보드 우측 상단의 **[Add New...]** $\rightarrow$ **[Project]** 를 클릭합니다.
3. 1단계에서 푸시한 **GitHub 저장소**를 찾아 **[Import]** 버튼을 클릭합니다.
4. **Configure Project** 설정 확인:
   - **Framework Preset**: `Vite` (자동 감지됨)
   - **Build Command**: `npm run build` (기본값 유지)
   - **Output Directory**: `dist` (기본값 유지)
   - **Root Directory**: `./` (기본값 유지)
5. *(선택 사항)* **Environment Variables (환경 변수)**:
   - AI 맞춤형 문제 생성 기능을 Vercel에서도 사용하려면:
     - Key: `GEMINI_API_KEY`
     - Value: `선생님의 Gemini API 키`
   - *(※ API 키가 없어도 앱 자체 내장된 문제 은행 및 실전 사례 모의고사가 100% 정상 작동합니다.)*
6. 하단의 **[Deploy]** 파란색 버튼을 누릅니다!
7. 약 30초~1분 후 **"Congratulations!"** 화면과 함께 영구적인 무료 웹 주소(예: `https://your-project.vercel.app`)가 생성됩니다.

---

## 3단계: 학생들에게 링크 공유 시 작동 방식

- **보안 잠금(Gatekeeper)**:
  - 1학년 5반 학생(김겸 등 26명 명단)은 이름과 반을 입력하면 정상 통과됩니다.
  - 타반 학생이나 미등록 학생이 진입하거나 답안을 제출하면 선생님 확인 화면으로 비밀리에 기록됩니다.
- **선생님 확인(대시보드)**:
  - 선생님 Google 계정(`tp15181234@gmail.com`)으로 로그인하시면 학생들의 실시간 답안 및 타반 진입 기록을 바로 확인하고 한 번에 비울 수 있습니다.
- **모바일/태블릿/카카오톡 인앱 브라우저 호환**:
  - 아이패드, 갤럭시탭, 스마트폰, 카카오톡 링크 공유 환경에서도 반응형 화면이 지원됩니다.
