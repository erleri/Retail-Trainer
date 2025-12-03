import ChatMessage from '../components/sales-lab/ChatMessage';

export default {
    title: 'Sales Lab/ChatMessage',
    component: ChatMessage,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isStreaming: { control: 'boolean' },
    },
};

export const UserMessage = {
    args: {
        message: {
            role: 'user',
            text: '안녕하세요, LG OLED TV에 대해 궁금한 점이 있습니다.',
        },
        isStreaming: false,
    },
};

export const AIMessage = {
    args: {
        message: {
            role: 'model',
            text: '반갑습니다! LG OLED TV는 백라이트 없이 스스로 빛을 내는 자발광 소자를 사용하여 완벽한 블랙과 무한한 명암비를 자랑합니다. 어떤 부분이 가장 궁금하신가요?',
        },
        isStreaming: false,
    },
};

export const AIMessageStreaming = {
    args: {
        message: {
            role: 'model',
            text: '현재 답변을 생성하고 있습니다...',
        },
        isStreaming: true,
    },
};

export const LongMessage = {
    args: {
        message: {
            role: 'model',
            text: `LG OLED TV의 주요 장점은 다음과 같습니다:

1. **완벽한 블랙**: 픽셀 하나하나가 꺼질 수 있어 진정한 블랙을 표현합니다.
2. **정확한 색 재현**: 원작자가 의도한 색상을 왜곡 없이 그대로 보여줍니다.
3. **빠른 응답 속도**: 0.1ms의 응답 속도로 게이밍에도 최적화되어 있습니다.
4. **슬림한 디자인**: 백라이트가 없어 종이처럼 얇은 디자인이 가능합니다.

추가로 궁금하신 점이 있으신가요?`,
        },
        isStreaming: false,
    },
};
