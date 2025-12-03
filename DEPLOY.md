# 🚀 배포 가이드 (Deployment Guide)

내일 회사에서 시연하기 위해 가장 빠르고 쉬운 **"Netlify Drop"** 방식을 안내해 드립니다.
이 방식은 복잡한 서버 설정 없이, 방금 생성한 결과물 폴더를 드래그 앤 드롭만 하면 즉시 웹사이트 주소가 생성됩니다.

## 1. 준비 완료 (Build Complete)
이미 제가 배포용 파일 생성을 완료했습니다.
- 생성된 폴더 위치: `c:\Users\Koo Imjun\GTM Manager\dist`

> **참고:** 이 폴더 안에는 웹사이트를 실행하는 데 필요한 모든 파일(HTML, CSS, JS)과 API 키가 포함되어 있습니다.

## 2. 배포 방법 (3분 소요)

1.  **Netlify Drop 접속**
    - 웹 브라우저에서 [https://app.netlify.com/drop](https://app.netlify.com/drop) 에 접속합니다.
    - (로그인이 필요할 수 있습니다. GitHub나 Google 계정으로 간편하게 로그인하세요.)

2.  **폴더 업로드**
    - 파일 탐색기를 엽니다.
    - `c:\Users\Koo Imjun\GTM Manager` 경로로 이동합니다.
    - **`dist`** 라는 이름의 폴더를 찾습니다.
    - 이 **`dist` 폴더 자체를** 브라우저의 "Drag and drop your site folder here" 영역으로 끌어다 놓습니다.

3.  **배포 완료 및 URL 확인**
    - 업로드가 완료되면 즉시 랜덤한 이름의 URL(예: `https://fluffy-unicorn-123456.netlify.app`)이 생성됩니다.
    - 이 주소를 복사해서 카카오톡이나 이메일로 회사 PC로 보내세요.

## 3. 회사에서 시연하기
1.  회사 PC에서 크롬 브라우저를 켭니다.
2.  복사해둔 URL로 접속합니다.
3.  마이크 권한을 허용하고 시연을 시작합니다! 🎉

---

### ⚠️ 주의사항
- **보안:** 현재 방식은 편의를 위해 API 키가 코드 안에 포함되어 빌드되었습니다. 시연 후에는 해당 Netlify 사이트를 삭제하거나, `VITE_GEMINI_API_KEY`를 변경하는 것이 안전합니다. (단기 시연용으로는 문제없습니다.)
- **업데이트:** 코드를 수정하면 다시 `npm run build`를 실행하고 위 과정을 반복해야 새로운 내용이 반영됩니다.
