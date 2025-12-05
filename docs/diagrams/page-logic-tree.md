# Page Logic Tree — Mermaid Diagram

아래는 `Retail-Trainer`의 페이지/컴포넌트 구조를 Mermaid 형식으로 시각화한 다이어그램입니다. 로컬에서 SVG/PNG로 렌더링하려면 `@mermaid-js/mermaid-cli`(mmdc)를 사용하세요.

```mermaid
graph TD
  A[HomeDashboard]\n-->|QuickStart| B[SalesLab]
  B --> B1[SalesLabSetup]
  B1 --> B1a[PersonaForm]
  B1 --> B1b[ProductSelect]
  B1 --> B1c[DifficultyToggle]
  B --> B2[SalesLabChat]
  B2 --> B2a[ChatMessageList]
  B2 --> B2b[InputBar]
  B2 --> B2c[VoiceControls]
  B2 --> B2d[EndSessionControl]
  B --> B3[SalesLabFeedback]
  B3 --> B3a[ScoreSummary]
  B3 --> B3b[SkillBars]
  B3 --> B3c[ProsImprovements]
  B3 --> B3d[RecommendedMissionCTA]
  B --> B4[SalesLabHistory]
  B4 --> B4a[SessionList]

  C[AIChatbot]
  C --> C1[ChatWindow]
  C --> C2[TopicSuggester]
  C --> C3[ExplanationPanel]

  D[StudyRoom]
  D --> D1[StudyResources]
  D --> D2[StudyRoomFAQ]

  E[Quiz]
  E --> E1[QuestionRenderer]
  E --> E2[AnswerInput]
  E --> E3[ResultsSummary]

  F[MyProgress]
  F --> F1[XPChart]
  F --> F2[MissionHistory]

  G[AdminConsole]
  G --> G1[ContentManagement]
  G --> G2[UserManagement]

  subgraph SharedUI
    UI1[Button]
    UI2[Input]
    UI3[Modal]
    UI4[ExpandableSection]
  end

  style A fill:#f9f,stroke:#333,stroke-width:1px
  style B fill:#bbf,stroke:#333,stroke-width:1px
  style C fill:#bfb,stroke:#333,stroke-width:1px
  style D fill:#ffd,stroke:#333,stroke-width:1px
  style E fill:#fdd,stroke:#333,stroke-width:1px
  style F fill:#dfd,stroke:#333,stroke-width:1px
  style G fill:#eee,stroke:#333,stroke-width:1px
```

렌더 방법 예시 (로컬):

```bash
# 전역 설치(또는 npx 사용 가능)
npm i -g @mermaid-js/mermaid-cli

# Mermaid 파일을 SVG로 변환
mmdc -i docs/diagrams/page-logic-tree.md -o docs/diagrams/page-logic-tree.svg

# 또는 Markdown 내의 mermaid 블록만 추출하여 .mmd로 저장한 뒤 변환
mmdc -i docs/diagrams/page-logic-tree.mmd -o docs/diagrams/page-logic-tree.svg
```

원하시면 제가 SVG로 렌더(환경에서 mmdc 설치 가능하면 실행)하거나, PNG로 변환한 후 `docs/diagrams/`에 추가해 드리겠습니다.
