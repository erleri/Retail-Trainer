# 🚀 빠른 배포 가이드 (Quick Deploy)

**빌드 완료!** 🎉

배포 준비가 모두 완료되었습니다. 아래 방법 중 하나를 선택하여 배포하세요.

---

## 📍 배포 위치
```
/workspaces/Retail-Trainer/dist
```

## 방법 1️⃣: Netlify Drop (가장 간단 - 3분)

### 단계별 진행:

1. **브라우저에서 Netlify Drop 열기**
   ```
   https://app.netlify.com/drop
   ```

2. **VS Code에서 dist 폴더 드래그**
   - 왼쪽 파일 탐색기에서 `dist` 폴더를 찾으세요
   - 브라우저의 "Drag and drop your site folder here" 영역으로 끌어다 놓으세요

3. **배포 완료 및 URL 확인**
   - 자동으로 배포되면 `https://xxxxx-xxxxx.netlify.app` 형태의 URL이 생성됩니다
   - 이 URL을 카톡/이메일로 공유하세요

---

## 방법 2️⃣: Vercel 배포 (자동 배포 설정)

이미 `vercel.json` 설정파일이 있습니다.

```bash
# 1. Vercel CLI 설치 (처음 1회만)
npm i -g vercel

# 2. 배포
vercel --prod --token $VERCEL_TOKEN
```

---

## 방법 3️⃣: GitHub Pages (무료 + 지속적)

현재 저장소: `https://github.com/erleri/Retail-Trainer`

1. GitHub 저장소 Settings → Pages 이동
2. Build and deployment → Source를 "GitHub Actions"로 선택
3. 자동으로 `dist` 폴더가 배포됨

---

## 🔗 배포 현황

| 항목 | 상태 | 
|------|------|
| 빌드 | ✅ 완료 (`dist/` 폴더) |
| 파일 크기 | 1.3 MB (압축됨) |
| 환경 변수 | ✅ .env에 포함됨 |
| SPA 라우팅 | ✅ 설정됨 |

---

## ⚠️ 배포 후 확인사항

1. **마이크 권한**
   - 처음 접속 시 브라우저에서 마이크 권한을 요청합니다
   - "허용" 클릭

2. **API 호출 확인**
   - 개발자 도구 (F12) → Network/Console 탭에서 Gemini API 호출 확인

3. **오류 발생 시**
   - 환경 변수 확인: `VITE_GEMINI_API_KEY` 유효성 검증

---

## 📱 모바일 테스트

배포된 URL을 모바일 브라우저에서 접속하여 반응형 레이아웃 테스트:

✅ 모바일 최적화 완료
- 작은 화면에 최적화된 UI
- 터치 입력 지원
- 마이크 권한 처리

---

## 🎯 시연 체크리스트

- [ ] 배포 URL 접속 확인
- [ ] 메인 페이지 로드됨
- [ ] Sales Lab 시작 가능
- [ ] 음성 입력 작동
- [ ] 피드백 표시 확인
- [ ] 모바일에서도 정상 작동

---

**질문이 있으면 README.md 또는 HANDOVER_GUIDE.md를 참고하세요!** 📚
