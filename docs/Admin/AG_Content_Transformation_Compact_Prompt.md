# **AG Ultra-Compact Prompt – Content & Quiz Transformation Rules**
Version: 1.0 Compact

---

## 목적
SourceContent를 안정적으로 LearningModule + QuizDraft로 변환하기 위한 최소 규칙 세트이다.

---

## 엔터티
- SourceContent: 원본 교육자료  
- LearningModule: 모바일 학습 모듈  
- Block: title/key_points/explanation/example/tip/micro_quiz  
- QuizDraft: 자동 생성 퀴즈  
- QuizBehavior: 오답 처리 규칙  

---

## LearningModule 생성 규칙
1. SourceContent에서 핵심 구조를 추출한다.  
2. 5~15개의 Block으로 분해한다.  
3. Block 타입은 반드시 아래 중 선택한다:  
   - title, key_points, explanation, example, tip, micro_quiz  
4. micro_quiz는 1~2문항으로 구성하며 너무 어렵게 만들지 않는다.  
5. 모든 출력은 간결하며 모바일로 읽기 쉽도록 구성해야 한다.

---

## QuizDraft 생성 규칙
1. LearningModule 내용을 기반으로 5~10문항 생성한다.  
2. 문제 유형: 단일선택/다중선택/True-False  
3. Distractor는 실제로 오해할 법한 선택지를 포함해야 한다.  
4. skillTag와 difficultyLevel을 가능하면 부여한다.  

---

## 오답 처리 규칙
1. 첫 시도 실패 → 정답 공개 금지, 모듈 재학습 유도  
2. 마지막 시도 실패 → 정답 + 해설 공개  
3. 반복 오답 → Skill 보강 추천  

---

## 출력 형식
- LearningModule(JSON)  
- QuizDraft(JSON)  

AG는 위 스키마/규칙을 변경하거나 임의 요소를 추가하면 안 된다.
