import { Star, Cpu, Zap, Layout } from 'lucide-react';

export const translations = {
    en: {
        nav: {
            home: 'Home Dashboard',
            study: 'Study Room',
            aiTrainer: 'AI Tutor',
            salesLab: 'Sales Lab',
            my: 'My',
            myProgress: 'My Progress',
            myProfile: 'My Profile',
            admin: 'Admin Console'
        },
        header: {
            title: 'TV Retail Trainer',
            welcome: 'Welcome back',
            online: 'Online',
            language: 'Language',
            aiTranslated: '✨ AI Translated',
            viewOriginal: '↩️ View Original'
        },
        common: {
            startNow: 'Start Now',
            viewAll: 'View All',
            loading: 'Loading...',
            error: 'An error occurred.',
            save: 'Save',
            cancel: 'Cancel'
        },
        home: {
            greeting: 'Hello,',
            subtitle: 'Ready to improve your sales skills?',
            currentLevel: 'Current Level',
            kpi: {
                xp: 'Weekly XP',
                sellout: 'Sell-out',
                rank: 'Ranking',
                trend: 'vs Last Week'
            },
            dailyGoal: {
                label: 'Daily Goal',
                progress: 'Progress',
                continue: 'Continue Learning'
            },
            aiFeed: {
                title: 'AI Tutor Insights'
            },
            activeMission: {
                title: 'Active Mission',
                progress: 'Progress'
            },
            quickActions: {
                title: 'Quick Actions',
                roleplay: 'Start Roleplay',
                leaderboard: 'View Leaderboard'
            },
            faqCard: {
                title: 'FAQ Quick Access',
                viewAll: 'View All FAQs'
            },
            attendance: {
                title: 'Attendance',
                streak: 'Day Streak',
                checkIn: 'Check In'
            }
        },
        study: {
            title: 'Study Room',
            subtitle: 'Access premium learning materials.',
            finishCourse: 'Take Quiz',
            nextModule: 'Next Module',
            prevModule: 'Prev Module',
            tabs: {
                curriculum: 'Curriculum',
                resources: 'Resources',
                discussion: 'Discussion',
                faq: 'FAQ'
            },
            faq: {
                searchPlaceholder: 'Search questions (e.g., OLED, Brightness)',
                categories: {
                    all: 'All',
                    Product: 'Product',
                    Usage: 'Usage',
                    Technology: 'Technology',
                    Basic: 'Basic'
                },
                views: 'Views',
                related: 'Related Questions'
            },
            courses: [
                {
                    id: 'g5-usp',
                    title: "Master the OLED G5 USP",
                    category: "Product Knowledge",
                    level: "Advanced",
                    duration: "15 min",
                    modules: [
                        {
                            id: 'm1',
                            title: "1. The Evolution: OLED evo",
                            content: [
                                { type: 'text', heading: "12 Years World's No.1", body: "LG OLED has been the world's best-selling OLED TV for 12 consecutive years." },
                                { type: 'key-point', heading: "Perfect Black & Perfect Color", body: "LG OLED delivers Perfect Black and 100% Color Fidelity." }
                            ]
                        }
                    ]
                }
            ],
            resources: {
                uploadTitle: "Click or Drag files to upload",
                uploadSubtitle: "Supports PDF, Images, Video (Max 10MB)",
                empty: "No resources uploaded yet. Add your study materials here."
            }
        },
        salesLab: {
            title: 'Sales Lab',
            subtitle: 'Real-world Sales Simulation',
            setup: {
                title: 'Roleplay Setup',
                selectProduct: 'Select Product',
                selectCustomer: 'Customer Profile',
                random: 'Randomize',
                start: 'Start Roleplay',
                products: {
                    oled: 'LG OLED TV (G5)',
                    qned: 'LG QNED TV (QNED90)',
                    uhd: 'LG UHD TV (UT80)'
                },
                traits: {
                    price: 'Price Sensitive',
                    tech: 'Tech Savvy',
                    brand: 'Brand Loyal',
                    skeptic: 'Skeptic',
                    family: 'Family Oriented',
                    gamer: 'Hardcore Gamer'
                }
            },
            chat: {
                title: 'Live Roleplay',
                endSession: 'End Session',
                autoModeOn: 'Auto Mode ON',
                autoModeOff: 'Auto Mode OFF',
                inputPlaceholder: 'Type your response...',
                listening: 'Listening...',
                guideTitle: 'Sales Guide',
                stageStrategy: 'Stage Strategy',
                sellingPoints: 'Key Selling Points',
                steps: {
                    greeting: 'Greeting',
                    needs: 'Needs Analysis',
                    proposal: 'Proposal',
                    objection: 'Objection Handling',
                    closing: 'Closing'
                },
                strategies: {
                    greeting: 'Start with a warm welcome and build rapport.',
                    needs: 'Focus on understanding their pain points.',
                    proposal: 'Link their needs to specific features.',
                    objection: 'Empathize, Clarify, and Isolate the objection.',
                    closing: 'Summarize the benefits and ask for the sale.'
                }
            },
            feedback: {
                title: 'Session Report',
                subtitle: 'Simulation',
                totalScore: 'Total Score',
                skillAnalysis: 'Skill Analysis',
                aiFeedback: 'AI Tutor Feedback',
                pros: 'Strengths',
                improvements: 'Improvements',
                practice: 'Practice this sentence',
                record: 'Record & Compare',
                mission: 'Recommended Mission',
                startMission: 'Start Mission',
                backToLab: 'Sales Lab Home',
                viewHistory: 'View History',
                loading: 'AI is analyzing your conversation...'
            }
        },
        objections: {
            price: {
                title: "Price Objection",
                summary: "Customer feels the product is too expensive.",
                logic: ["Emphasize Long-term Value", "Explain Premium Features", "Mention Warranty"],
                demo: "Show 'Perfect Black' demo.",
                source: "Sales Manual v2.4"
            },
            brightness: {
                title: "Brightness Objection",
                summary: "Customer believes OLED is too dark.",
                logic: ["Explain 'Perceived Brightness'", "Mention MLA Technology", "Emphasize Home Environment"],
                demo: "Show 'HDR Impact' demo.",
                source: "Tech Brief 2024-Q4"
            }
        }
    },
    ko: {
        nav: {
            home: '홈 대시보드',
            study: '공부방',
            aiTrainer: 'AI 튜터',
            salesLab: 'Sales Lab',
            my: '마이',
            myProgress: '나의 성장',
            myProfile: '프로필 설정',
            admin: '관리자 설정'
        },
        header: {
            title: 'TV Retail Trainer',
            welcome: '환영합니다',
            online: '온라인',
            language: '언어 변경',
            aiTranslated: '✨ AI 번역됨',
            viewOriginal: '↩️ 원본 보기'
        },
        common: {
            startNow: '시작하기',
            viewAll: '전체보기',
            loading: '로딩 중...',
            error: '오류가 발생했습니다.',
            save: '저장',
            cancel: '취소'
        },
        home: {
            greeting: '안녕하세요,',
            subtitle: '오늘도 세일즈 스킬을 향상시켜 볼까요?',
            currentLevel: '현재 레벨',
            kpi: {
                xp: '주간 XP',
                sellout: '판매 실적',
                rank: '랭킹',
                trend: '지난주 대비'
            },
            dailyGoal: {
                label: '오늘의 목표',
                progress: '진행률',
                continue: '학습 계속하기'
            },
            aiFeed: {
                title: 'AI 튜터 인사이트'
            },
            activeMission: {
                title: '진행 중인 미션',
                progress: '진행 상황'
            },
            quickActions: {
                title: '빠른 실행',
                roleplay: '롤플레잉 시작',
                leaderboard: '리더보드 보기'
            },
            faqCard: {
                title: 'FAQ 바로가기',
                viewAll: '전체 FAQ 보기'
            },
            attendance: {
                title: '출석 체크',
                streak: '일 연속',
                checkIn: '출석하기'
            }
        },
        study: {
            title: '공부방',
            subtitle: '프리미엄 학습 자료를 확인하세요.',
            finishCourse: '퀴즈 풀기',
            nextModule: '다음 모듈',
            prevModule: '이전 모듈',
            tabs: {
                curriculum: '학습 챕터',
                resources: '자료실',
                discussion: '토론방',
                faq: 'FAQ'
            },
            faq: {
                searchPlaceholder: '질문 검색 (예: OLED, 밝기)',
                categories: {
                    all: '전체',
                    Product: '제품별',
                    Usage: '사용법',
                    Technology: '기술',
                    Basic: '기본 질문'
                },
                views: '조회수',
                related: '관련 질문'
            },
            courses: [
                {
                    id: 'g5-usp',
                    title: "OLED G5 USP 마스터하기",
                    category: "제품 지식",
                    level: "고급",
                    duration: "15분",
                    modules: [
                        {
                            id: 'm1',
                            title: "1. 진화: OLED evo",
                            content: [
                                { type: 'text', heading: "12년 연속 세계 판매 1위", body: "LG OLED는 12년 연속 세계에서 가장 많이 팔린 OLED TV입니다." },
                                { type: 'key-point', heading: "퍼펙트 블랙 & 퍼펙트 컬러", body: "LG OLED는 완벽한 블랙과 100% 색 재현율을 제공합니다." }
                            ]
                        }
                    ]
                }
            ],
            resources: {
                uploadTitle: "파일을 클릭하거나 드래그하여 업로드",
                uploadSubtitle: "PDF, 이미지, 동영상 지원 (최대 10MB)",
                empty: "업로드된 자료가 없습니다. 학습 자료를 추가해보세요."
            }
        },
        salesLab: {
            title: '세일즈 랩',
            subtitle: '실전 고객 응대 시뮬레이션',
            setup: {
                title: '롤플레잉 설정',
                selectProduct: '제품 선택',
                selectCustomer: '고객 설정',
                random: '랜덤 생성',
                start: '롤플레잉 시작',
                products: {
                    oled: 'LG OLED TV (G5)',
                    qned: 'LG QNED TV (QNED90)',
                    uhd: 'LG UHD TV (UT80)'
                },
                traits: {
                    price: '가격 민감형',
                    tech: '테크 전문가형',
                    brand: '브랜드 충성형',
                    skeptic: '의심 많은 유형',
                    family: '가족 중심형',
                    gamer: '하드코어 게이머'
                }
            },
            chat: {
                title: '실전 롤플레잉',
                endSession: '세션 종료',
                autoModeOn: '자동 모드 ON',
                autoModeOff: '자동 모드 OFF',
                inputPlaceholder: '메시지를 입력하세요...',
                listening: '듣고 있습니다...',
                guideTitle: '세일즈 가이드',
                stageStrategy: '단계별 전략',
                sellingPoints: '핵심 셀링 포인트',
                steps: {
                    greeting: '도입 (Greeting)',
                    needs: '탐색 (Needs)',
                    proposal: '제안 (Proposal)',
                    objection: '거절극복 (Objection)',
                    closing: '클로징 (Closing)'
                },
                strategies: {
                    greeting: '밝은 미소로 맞이하고, 라포(Rapport)를 형성하세요.',
                    needs: '고객의 불편함(Pain Point)을 파악하세요.',
                    proposal: '고객의 니즈와 제품의 특장점을 연결하세요.',
                    objection: '거절을 두려워하지 마세요. 공감하고 해결책을 제시하세요.',
                    closing: '혜택을 요약하고, 자신감 있게 구매를 권유하세요.'
                }
            },
            feedback: {
                title: '세션 리포트',
                subtitle: '시뮬레이션 결과',
                totalScore: '종합 점수',
                skillAnalysis: '스킬 분석',
                aiFeedback: 'AI 튜터 피드백',
                pros: '잘한 점',
                improvements: '개선할 점',
                practice: '이 문장을 연습해보세요',
                record: '녹음 & 비교',
                mission: '추천 미션',
                startMission: '미션 시작',
                backToLab: '세일즈 랩 홈',
                viewHistory: '히스토리 보기',
                loading: 'AI가 대화를 분석하고 있습니다...'
            }
        },
        objections: {
            price: {
                title: "가격 저항",
                summary: "고객이 제품 가격이 너무 비싸다고 느낍니다.",
                logic: ["장기적 가치 강조", "프리미엄 기능 설명", "AS 장점 언급"],
                demo: "'Perfect Black' 데모 시연",
                source: "Sales Manual v2.4"
            },
            brightness: {
                title: "밝기 우려",
                summary: "고객이 OLED는 어둡다는 편견을 가지고 있습니다.",
                logic: ["무한대 명암비 설명", "MLA 기술 언급", "실제 가정 환경 강조"],
                demo: "'HDR Impact' 데모 시연",
                source: "Tech Brief 2024-Q4"
            }
        }
    },
    es: {
        nav: {
            home: 'Panel de Inicio',
            study: 'Sala de Estudio',
            aiTrainer: 'Entrenador IA',
            salesLab: 'Laboratorio de Ventas',
            my: 'Mi',
            myProgress: 'Mi Progreso',
            myProfile: 'Mi Perfil',
            admin: 'Administración'
        },
        header: {
            title: 'TV Retail Trainer',
            welcome: 'Bienvenido',
            online: 'En línea',
            language: 'Idioma',
            aiTranslated: '✨ Traducido por IA',
            viewOriginal: '↩️ Ver Original'
        },
        common: {
            startNow: 'Empezar',
            viewAll: 'Ver Todo',
            loading: 'Cargando...',
            error: 'Ocurrió un error.',
            save: 'Guardar',
            cancel: 'Cancelar'
        },
        home: {
            greeting: 'Hola,',
            subtitle: '¿Listo para mejorar tus habilidades?',
            currentLevel: 'Nivel Actual',
            kpi: {
                xp: 'XP Semanal',
                sellout: 'Ventas',
                rank: 'Ranking',
                trend: 'vs Semana Pasada'
            },
            dailyGoal: {
                label: 'Meta Diaria',
                progress: 'Progreso',
                continue: 'Continuar'
            },
            aiFeed: {
                title: 'Insights del Entrenador IA'
            },
            activeMission: {
                title: 'Misión Activa',
                progress: 'Progreso'
            },
            quickActions: {
                title: 'Acciones Rápidas',
                roleplay: 'Iniciar Roleplay',
                leaderboard: 'Ver Tabla'
            },
            faqCard: {
                title: 'Acceso Rápido a FAQ',
                viewAll: 'Ver Todo'
            },
            attendance: {
                title: 'Asistencia',
                streak: 'Días Racha',
                checkIn: 'Registrar'
            }
        },
        study: {
            title: 'Sala de Estudio',
            subtitle: 'Materiales de aprendizaje premium.',
            finishCourse: 'Tomar Quiz',
            nextModule: 'Siguiente',
            prevModule: 'Anterior',
            tabs: {
                curriculum: 'Curículo',
                resources: 'Recursos',
                discussion: 'Discusión',
                faq: 'FAQ'
            },
            faq: {
                searchPlaceholder: 'Buscar preguntas',
                categories: {
                    all: 'Todo',
                    Product: 'Producto',
                    Usage: 'Uso',
                    Technology: 'Tecnología',
                    Basic: 'Básico'
                },
                views: 'Vistas',
                related: 'Relacionado'
            },
            courses: []
        },
        salesLab: {
            title: 'Laboratorio de Ventas',
            subtitle: 'Simulación de Ventas Real',
            setup: {
                title: 'Configuración',
                selectProduct: 'Producto',
                selectCustomer: 'Cliente',
                random: 'Aleatorio',
                start: 'Iniciar',
                products: {
                    oled: 'LG OLED TV (G5)',
                    qned: 'LG QNED TV (QNED90)',
                    uhd: 'LG UHD TV (UT80)'
                },
                traits: {
                    price: 'Sensible al Precio',
                    tech: 'Experto Tech',
                    brand: 'Leal a Marca',
                    skeptic: 'Escéptico',
                    family: 'Familiar',
                    gamer: 'Gamer'
                }
            },
            chat: {
                title: 'Roleplay en Vivo',
                endSession: 'Terminar',
                autoModeOn: 'Auto ON',
                autoModeOff: 'Auto OFF',
                inputPlaceholder: 'Escribe...',
                listening: 'Escuchando...',
                guideTitle: 'Guía',
                stageStrategy: 'Estrategia',
                sellingPoints: 'Puntos Clave',
                steps: {
                    greeting: 'Saludo',
                    needs: 'Necesidades',
                    proposal: 'Propuesta',
                    objection: 'Objeciones',
                    closing: 'Cierre'
                },
                strategies: {
                    greeting: 'Bienvenida cálida.',
                    needs: 'Entender dolor.',
                    proposal: 'Vincular necesidades.',
                    objection: 'Empatizar y aclarar.',
                    closing: 'Pedir venta.'
                }
            },
            feedback: {
                title: 'Reporte',
                subtitle: 'Simulación',
                totalScore: 'Puntaje',
                skillAnalysis: 'Análisis',
                aiFeedback: 'Feedback IA',
                pros: 'Fortalezas',
                improvements: 'Mejoras',
                practice: 'Practicar',
                record: 'Grabar',
                mission: 'Misión',
                startMission: 'Iniciar',
                backToLab: 'Volver',
                viewHistory: 'Historial',
                loading: 'Analizando...'
            }
        },
        objections: {
            price: {
                title: "Precio",
                summary: "Muy caro.",
                logic: ["Valor a largo plazo", "Premium", "Garantía"],
                demo: "Demo Perfect Black",
                source: "Manual"
            },
            brightness: {
                title: "Brillo",
                summary: "Muy oscuro.",
                logic: ["Contraste", "MLA", "Entorno"],
                demo: "Demo HDR",
                source: "Tech Brief"
            }
        }
    },
    'pt-br': {
        nav: {
            home: 'Painel Inicial',
            study: 'Sala de Estudo',
            aiTrainer: 'Treinador IA',
            salesLab: 'Laboratório de Vendas',
            my: 'Meu',
            myProgress: 'Meu Progresso',
            myProfile: 'Meu Perfil',
            admin: 'Administração'
        },
        header: {
            title: 'TV Retail Trainer',
            welcome: 'Bem-vindo',
            online: 'Online',
            language: 'Idioma',
            aiTranslated: '✨ Traduzido por IA',
            viewOriginal: '↩️ Ver Original'
        },
        common: {
            startNow: 'Começar',
            viewAll: 'Ver Tudo',
            loading: 'Carregando...',
            error: 'Ocorreu um erro.',
            save: 'Salvar',
            cancel: 'Cancelar'
        },
        home: {
            greeting: 'Olá,',
            subtitle: 'Pronto para melhorar?',
            currentLevel: 'Nível Atual',
            kpi: {
                xp: 'XP Semanal',
                sellout: 'Vendas',
                rank: 'Ranking',
                trend: 'vs Semana Passada'
            },
            dailyGoal: {
                label: 'Meta Diária',
                progress: 'Progresso',
                continue: 'Continuar'
            },
            aiFeed: {
                title: 'Insights do Treinador IA'
            },
            activeMission: {
                title: 'Missão Ativa',
                progress: 'Progresso'
            },
            quickActions: {
                title: 'Ações Rápidas',
                roleplay: 'Iniciar Roleplay',
                leaderboard: 'Ver Classificação'
            },
            faqCard: {
                title: 'Acesso Rápido a FAQ',
                viewAll: 'Ver Tudo'
            },
            attendance: {
                title: 'Presença',
                streak: 'Dias Seguidos',
                checkIn: 'Check-in'
            }
        },
        study: {
            title: 'Sala de Estudo',
            subtitle: 'Materiais de aprendizado.',
            finishCourse: 'Fazer Quiz',
            nextModule: 'Próximo',
            prevModule: 'Anterior',
            tabs: {
                curriculum: 'Currículo',
                resources: 'Recursos',
                discussion: 'Discussão',
                faq: 'FAQ'
            },
            faq: {
                searchPlaceholder: 'Pesquisar',
                categories: {
                    all: 'Tudo',
                    Product: 'Produto',
                    Usage: 'Uso',
                    Technology: 'Tecnologia',
                    Basic: 'Básico'
                },
                views: 'Visualizações',
                related: 'Relacionado'
            },
            courses: []
        },
        salesLab: {
            title: 'Laboratório de Vendas',
            subtitle: 'Simulação Real',
            setup: {
                title: 'Configuração',
                selectProduct: 'Produto',
                selectCustomer: 'Cliente',
                random: 'Aleatório',
                start: 'Iniciar',
                products: {
                    oled: 'LG OLED TV (G5)',
                    qned: 'LG QNED TV (QNED90)',
                    uhd: 'LG UHD TV (UT80)'
                },
                traits: {
                    price: 'Sensível a Preço',
                    tech: 'Entusiasta Tech',
                    brand: 'Leal à Marca',
                    skeptic: 'Cético',
                    family: 'Família',
                    gamer: 'Gamer'
                }
            },
            chat: {
                title: 'Roleplay ao Vivo',
                endSession: 'Encerrar',
                autoModeOn: 'Auto ON',
                autoModeOff: 'Auto OFF',
                inputPlaceholder: 'Digite...',
                listening: 'Ouvindo...',
                guideTitle: 'Guia',
                stageStrategy: 'Estratégia',
                sellingPoints: 'Pontos Chave',
                steps: {
                    greeting: 'Saudação',
                    needs: 'Necessidades',
                    proposal: 'Proposta',
                    objection: 'Objeções',
                    closing: 'Fechamento'
                },
                strategies: {
                    greeting: 'Recepção calorosa.',
                    needs: 'Entender dor.',
                    proposal: 'Vincular necessidades.',
                    objection: 'Empatia e clareza.',
                    closing: 'Pedir venda.'
                }
            },
            feedback: {
                title: 'Relatório',
                subtitle: 'Simulação',
                totalScore: 'Pontuação',
                skillAnalysis: 'Análise',
                aiFeedback: 'Feedback IA',
                pros: 'Pontos Fortes',
                improvements: 'Melhorias',
                practice: 'Praticar',
                record: 'Gravar',
                mission: 'Missão',
                startMission: 'Iniciar',
                backToLab: 'Volver',
                viewHistory: 'Histórico',
                loading: 'Analisando...'
            }
        },
        objections: {
            price: {
                title: "Preço",
                summary: "Muito caro.",
                logic: ["Valor Longo Prazo", "Premium", "Garantia"],
                demo: "Demo Perfect Black",
                source: "Manual"
            },
            brightness: {
                title: "Brilho",
                summary: "Muito escuro.",
                logic: ["Contraste", "MLA", "Ambiente"],
                demo: "Demo HDR",
                source: "Tech Brief"
            }
        }
    }
};
