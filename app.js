/* ==========================================================================
   타임머신 역사 마을 방탈출 GAME ENGINE & DATA (초등 5학년 사회 연계)
   - 각 방별 10개 이상 문제 데이터 풀 (총 150개 이상 문제)
   - 풀었던 문제 중복 방지 (Solved Questions Filter)
   - 오답 노트 & 복습 모드 (Wrong Answer Review System)
   - 멀티 플레이어/학생 로그인 연동 (Account Switcher)
   - Firebase Auth & Firestore 클라우드 데이터 안전 동기화
   - [Fix] 타임머신 에너지 100% 충전 전 다른 시대 이동 불가 (시대 잠금/해금 시스템)
   ========================================================================== */

// Web Audio API Sound Synthesizer
class SoundEngine {
    constructor() {
        this.ctx = null;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    play(type) {
        try {
            this.init();
            if (!this.ctx) return;
            
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (type === 'clue') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'correct') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554.37, now + 0.1);
                osc.frequency.setValueAtTime(659.25, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(110, now + 0.25);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'tick') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'warp') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.8);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
                osc.start(now);
                osc.stop(now + 0.9);
            }
        } catch (e) {
            console.log('Audio Context muted', e);
        }
    }
}

const audioSFX = new SoundEngine();

// ==========================================================================
// 5TH GRADE HISTORY DATABASE (5 ERAS x 3 ROOMS = 15 ROOMS, EACH HAS 10+ QUESTIONS)
// ==========================================================================
const HISTORY_GAME_DATA = {
    1: {
        eraName: "선사 & 고조선 시대",
        bgImg: "images/prehistoric_village.jpg",
        rooms: [
            {
                name: "1번 방: 선사 시대 움집",
                desc: "신석기 사람들의 움집 내부에서 빗살무늬 토기와 간석기의 힌트를 찾아라!",
                hotspots: [
                    { title: "움집 중앙 화덕", icon: "fa-fire-burner", top: "55%", left: "45%", clueName: "움집과 정착 생활", clueText: "신석기 시대 사람들은 움집을 짓고 농경과 정착 생활을 시작했습니다.", eduTip: "농경(농사)과 정착 생활의 시작 = 신석기 혁명" },
                    { title: "빗살무늬 토기", icon: "fa-jar", top: "60%", left: "20%", clueName: "식량 저장 토기", clueText: "곡식을 저장하고 조리하기 위해 뾰족한 아래와 빗살 무늬를 새긴 토기입니다.", eduTip: "신석기 대표 토기 = 빗살무늬 토기" },
                    { title: "간석기 도구함", icon: "fa-cubes", top: "35%", left: "75%", clueName: "갈아서 만든 간석기", clueText: "돌을 떼어내던 구석기 시대와 달리, 돌을 정교하게 갈아서 만든 간석기입니다.", eduTip: "간석기 = 돌을 갈아서 정교하게 만든 도구" }
                ],
                puzzles: [
                    { id: "e1_r1_q1", type: "quiz", question: "신석기 시대에 식량을 저장하고 조리하기 위해 만든 대표적인 토기는?", options: ["빗살무늬 토기", "고려청자", "조선백자", "토기 인형"], answerIdx: 0, relicName: "빗살무늬 토기", relicDesc: "신석기 시대 대표 유물", eduTip: "빗살무늬 토기는 신석기 시대 식량 보관용 유물입니다." },
                    { id: "e1_r1_q2", type: "quiz", question: "구석기 시대 사람들이 돌을 떼어내어 만든 도구의 명칭은?", options: ["뗀석기", "간석기", "비파형 동검", "철제 농기구"], answerIdx: 0, relicName: "뗀석기", relicDesc: "구석기 시대 석기", eduTip: "구석기시대 = 뗀석기(주먹도끼), 신석기시대 = 간석기" },
                    { id: "e1_r1_q3", type: "quiz", question: "신석기 시대에 일어난 가장 큰 생활 모습의 변화는?", options: ["농경과 정착 생활의 시작", "철제 무기 사용", "벼농사와 계급 발생", "글자 사용"], answerIdx: 0, relicName: "신석기 농경 유적", relicDesc: "농사의 시작", eduTip: "농사와 가축 사육을 시작하면서 움집을 짓고 정착했습니다." },
                    { id: "e1_r1_q4", type: "quiz", question: "신석기 사람들이 만든 원형이나 사각형 형태의 반지하 집은?", options: ["움집", "한옥", "귀틀집", "너와집"], answerIdx: 0, relicName: "신석기 움집", relicDesc: "신석기 보금자리", eduTip: "강가나 바닷가에 움을 파고 기둥을 세운 움집에서 살았습니다." },
                    { id: "e1_r1_q5", type: "quiz", question: "구석기 시대 사람들의 주요 생활 모습이 아닌 것은?", options: ["벼농사 지어 정착하기", "동굴이나 막집에 살기", "사냥과 채집하기", "떼어낸 돌 도구 사용하기"], answerIdx: 0, relicName: "구석기 동굴 유적", relicDesc: "사냥과 채집", eduTip: "구석기인들은 사냥감을 찾아 이동 생활을 했습니다." },
                    { id: "e1_r1_q6", type: "quiz", question: "신석기 시대에 가락바퀴와 뼈바늘을 이용해 만든 것은?", options: ["옷과 그물", "철갑옷", "청동 거울", "수원화성"], answerIdx: 0, relicName: "가락바퀴", relicDesc: "실을 잣는 도구", eduTip: "가락바퀴로 실을 뽑아 옷과 그물을 만들었습니다." },
                    { id: "e1_r1_q7", type: "quiz", question: "신석기 시대 석기를 만드는 방법으로 옳은 것은?", options: ["돌을 숫돌에 갈아서 만든다", "청동을 녹여 굳힌다", "돌을 단순히 떼어낸다", "철을 대장간에서 두드린다"], answerIdx: 0, relicName: "간석기 돌도끼", relicDesc: "정교한 돌도구", eduTip: "간석기는 돌을 갈아서(磨) 더 정교하게 만들었습니다." },
                    { id: "e1_r1_q8", type: "quiz", question: "구석기 시대를 대표하는 유명한 뗀석기 유물은?", options: ["주먹도끼", "반달 돌칼", "비파형 동검", "상감청자"], answerIdx: 0, relicName: "연천 전곡리 주먹도끼", relicDesc: "구석기 만능 도구", eduTip: "연천 전곡리 주먹도끼는 아슐리안형 주먹도끼입니다." },
                    { id: "e1_r1_q9", type: "quiz", question: "신석기 시대 마을 유적이 발견된 서울의 대표적 장소는?", options: ["암사동 유적", "경복궁", "독립문", "벽란도"], answerIdx: 0, relicName: "서울 암사동 유적", relicDesc: "신석기 대표 유적지", eduTip: "서울 암사동에는 신석기 움집터가 보존되어 있습니다." },
                    { id: "e1_r1_q10", type: "quiz", question: "신석기인들이 자연물이나 동물, 조상 신을 섬기던 원시 신앙은?", options: ["애니미즘과 샤머니즘", "유교", "불교", "기독교"], answerIdx: 0, relicName: "신석기 조개 가면", relicDesc: "원시 신앙", eduTip: "태양, 물, 동물을 신성시하며 풍요를 기원했습니다." }
                ]
            },
            {
                name: "2번 방: 고인돌 거석 방",
                desc: "청동기 시대 지배자의 무덤인 고인돌과 비파형 동검의 비밀!",
                hotspots: [
                    { title: "탁자식 고인돌", icon: "fa-monument", top: "40%", left: "30%", clueName: "지배자의 무덤 고인돌", clueText: "청동기 시대 계급 발생을 보여주는 거대한 돌 무덤입니다.", eduTip: "세계적 고인돌 유적지 = 고창, 화순, 강화" },
                    { title: "비파형 동검", icon: "fa-khanda", top: "50%", left: "68%", clueName: "청동기 비파형 동검", clueText: "중국 악기 비파를 닮은 청동기 시대 대표 무기입니다.", eduTip: "청동기 대표 무기 = 비파형 동검" },
                    { title: "반달 돌칼", icon: "fa-scissors", top: "65%", left: "50%", clueName: "곡물 수확용 반달 돌칼", clueText: "벼 이삭을 따기 위해 사용된 청동기 시대의 돌 농기구입니다.", eduTip: "청동기에도 농기구는 돌과 나무 사용" }
                ],
                puzzles: [
                    { id: "e1_r2_q1", type: "quiz", question: "청동기 시대 계급의 발생과 지배자의 권력을 보여주는 거대한 돌무덤은?", options: ["고인돌", "무령왕릉", "석가탑", "첨성대"], answerIdx: 0, relicName: "고인돌", relicDesc: "청동기 거석 무덤", eduTip: "고인돌을 만드는 데 수많은 인력이 동원되었습니다." },
                    { id: "e1_r2_q2", type: "quiz", question: "청동기 시대를 대표하는 비파 모양의 청동 검은?", options: ["비파형 동검", "세형 동검", "환두대도", "사인검"], answerIdx: 0, relicName: "비파형 동검", relicDesc: "청동기 대표 무기", eduTip: "비파형 동검은 만주와 한반도 청동기 문화의 상징입니다." },
                    { id: "e1_r2_q3", type: "quiz", question: "청동기 시대에 벼농사를 지으면서 곡물 이삭을 자를 때 쓴 도구는?", options: ["반달 돌칼", "빗살무늬 토기", "주먹도끼", "화포"], answerIdx: 0, relicName: "반달 돌칼", relicDesc: "청동기 수확 농기구", eduTip: "구멍에 끈을 꿰어 손가락에 걸고 이삭을 땄습니다." },
                    { id: "e1_r2_q4", type: "quiz", question: "청동기 시대 사회 모습으로 옳은 것은?", options: ["사유 재산과 계급 발생", "평등한 공동체 생활", "세계 최초 금속활자 사용", "독립문 건립"], answerIdx: 0, relicName: "청동기 민무늬 토기", relicDesc: "계급 사회의 시작", eduTip: "빈부 격차와 족장이 등장했습니다." },
                    { id: "e1_r2_q5", type: "quiz", question: "우리나라 고인돌 유적지로 유네스코 세계유산에 등재된 곳이 아닌 것은?", options: ["경주 불국사", "전북 고창", "전남 화순", "인천 강화"], answerIdx: 0, relicName: "강화 고인돌", relicDesc: "세계유산 고인돌", eduTip: "고창, 화순, 강화 고인돌군이 세계유산입니다." },
                    { id: "e1_r2_q6", type: "quiz", question: "청동기 시대 붉은 흙으로 만들어 무늬가 없는 토기는?", options: ["민무늬 토기", "빗살무늬 토기", "고려청자", "조선백자"], answerIdx: 0, relicName: "민무늬 토기", relicDesc: "청동기 토기", eduTip: "민무늬 토기는 붉은토기와 팽이형 토기가 있습니다." },
                    { id: "e1_r2_q7", type: "quiz", question: "청동기 시대 제사장이 사용한 의식용 도구는?", options: ["청동 거울과 청동 방울", "빗살무늬 토기", "거중기", "앙부일구"], answerIdx: 0, relicName: "팔주령 청동 방울", relicDesc: "제사장 의식 도구", eduTip: "제정일치 사회에서 제사장이 청동 방울을 흔들었습니다." },
                    { id: "e1_r2_q8", type: "quiz", question: "청동을 만드는 데 필요한 금속의 조합은?", options: ["구리와 구리/구리와 틴(구리+구리/아연)", "철과 숯", "흙과 불", "금과 은"], answerIdx: 0, relicName: "청동 용범(거푸집)", relicDesc: "청동 주조틀", eduTip: "구리에 주석이나 아연을 섞어 만들었습니다." },
                    { id: "e1_r2_q9", type: "quiz", question: "청동기 시대 마을 주위에 도랑을 파고 목책을 세운 이유는?", options: ["다른 부족의 침입을 막기 위해", "농사를 짓기 위해", "물고기를 잡기 위해", "고인돌을 운반하기 위해"], answerIdx: 0, relicName: "환호 유적", relicDesc: "방어 시설", eduTip: "부족 간 전쟁이 빈번해지면서 방어 시설을 구축했습니다." },
                    { id: "e1_r2_q10", type: "quiz", question: "청동기 시대 족장이 죽었을 때 무덤 속에 함께 묻은 것은?", options: ["비파형 동검과 청동 거울", "팔만대장경", "훈민정음", "전차 모형"], answerIdx: 0, relicName: "청동 껴묻거리", relicDesc: "부장품", eduTip: "권력을 과시하기 위해 귀한 청동기 무기와 장신구를 묻었습니다." }
                ]
            },
            {
                name: "3번 방: 단군왕검 고조선 제단",
                desc: "우리나라 최초의 국가 고조선의 건국 신화와 8조법 암호!",
                hotspots: [
                    { title: "삼국유사 기록 족자", icon: "fa-scroll", top: "35%", left: "25%", clueName: "최초의 국가 고조선", clueText: "BC 2333년 단군왕검이 세운 우리나라 최초의 국가입니다.", eduTip: "10월 3일 개천절 = 고조선 건국 기념일" },
                    { title: "홍익인간 각인", icon: "fa-hands-holding-circle", top: "45%", left: "55%", clueName: "홍익인간 건국 이념", clueText: "'널리 인간 세상을 이롭게 한다'는 뜻의 홍익인간입니다.", eduTip: "홍익인간 = 널리 인간을 이롭게 함" },
                    { title: "8조법 비석", icon: "fa-gavel", top: "60%", left: "80%", clueName: "사회 질서 8조법", clueText: "생명과 재산을 지키기 위해 고조선에 존재한 8개의 법입니다.", eduTip: "고조선 8조법 = 노동력과 사유재산 보호" }
                ],
                puzzles: [
                    { id: "e1_r3_q1", type: "digit", question: "고조선의 사회 질서와 국민을 보호하기 위해 만든 법의 개수(숫자)는?", answer: "8", relicName: "고조선 8조법", relicDesc: "고조선 법률", eduTip: "현재 3개의 조항이 전해집니다 (살인, 상해, 도둑질)." },
                    { id: "e1_r3_q2", type: "quiz", question: "BC 2333년 우리나라 역사상 최초로 세워진 국가의 이름은?", options: ["고조선", "고려", "신라", "조선"], answerIdx: 0, relicName: "고조선 건국 유산", relicDesc: "최초의 국가", eduTip: "단군왕검이 아사달에 도읍을 정하고 세웠습니다." },
                    { id: "e1_r3_q3", type: "quiz", question: "고조선의 건국 이념인 '홍익인간'의 뜻으로 옳은 것은?", options: ["널리 인간 세상을 이롭게 한다", "나라를 용맹하게 지킨다", "부처님의 힘으로 침입을 막는다", "모든 국민이 평등하게 사산한다"], answerIdx: 0, relicName: "홍익인간 비석", relicDesc: "건국 이념", eduTip: "대한민국 교육의 기본 이념이기도 합니다." },
                    { id: "e1_r3_q4", type: "quiz", question: "고조선을 건국한 지도자의 명칭은?", options: ["단군왕검", "주몽", "온조", "박혁거세"], answerIdx: 0, relicName: "단군왕검 초상", relicDesc: "고조선 건국자", eduTip: "단군(제사장) + 왕검(정치 지도자)의 뜻입니다." },
                    { id: "e1_r3_q5", type: "quiz", question: "하늘이 열리고 고조선이 건국된 날을 기념하는 국경일은?", options: ["개천절 (10월 3일)", "광복절 (8월 15일)", "삼일절 (3월 1일)", "한글날 (10월 9일)"], answerIdx: 0, relicName: "개천절 기념 태극기", relicDesc: "개천절", eduTip: "매년 10월 3일은 개천절입니다." },
                    { id: "e1_r3_q6", type: "quiz", question: "고조선의 영향력을 알 수 있는 대표적인 두 가지 유물은?", options: ["비파형 동검과 탁자식 고인돌", "팔만대장경과 고려청자", "측우기와 앙부일구", "독립문과 태극기"], answerIdx: 0, relicName: "고조선 문화 범위 지도", relicDesc: "비파형동검 문화권", eduTip: "비파형 동검과 탁자식 고인돌의 출토 범위가 고조선의 영토입니다." },
                    { id: "e1_r3_q7", type: "quiz", question: "단군 신화에 등장하여 쑥과 마늘을 먹고 사람이 된 동물은?", options: ["곰", "호랑이", "사자", "독수리"], answerIdx: 0, relicName: "단군 신화 곰 부족", relicDesc: "웅녀", eduTip: "곰 부족(웅녀)과 하늘 신 환웅 부족의 결합을 상징합니다." },
                    { id: "e1_r3_q8", type: "quiz", question: "단군 신화 내용 중 농사에 필요한 바람, 비, 구름을 주관하는 신하를 데리고 내려온 하늘의 신은?", options: ["환웅", "주몽", "혁거세", "수로왕"], answerIdx: 0, relicName: "환웅과 풍백·우사·운사", relicDesc: "농경 사회 상징", eduTip: "고조선 사회가 농경을 매우 중요하게 여겼음을 뜻합니다." },
                    { id: "e1_r3_q9", type: "quiz", question: "고조선 8조법 중 남의 물건을 훔친 자는 어떻게 처벌했는가?", options: ["노비로 삼거나 돈으로 갚게 함", "사형에 처함", "추방함", "상금을 줌"], answerIdx: 0, relicName: "고조선 8조법 기록", relicDesc: "노비와 사유재산", eduTip: "사유 재산과 계급 사회였음을 증명합니다." },
                    { id: "e1_r3_q10", type: "quiz", question: "고조선 후기 철기 문화를 받아들여 세력을 크게 확장한 왕은?", options: ["위만", "온조왕", "광개토대왕", "세종대왕"], answerIdx: 0, relicName: "위만조선 유물", relicDesc: "위만조선", eduTip: "위만이 집권하면서 본격적인 철기 시대가 열렸습니다." }
                ]
            }
        ]
    },
    2: {
        eraName: "삼국 & 통일신라 시대",
        bgImg: "images/three_kingdoms_village.jpg",
        rooms: [
            {
                name: "1번 방: 고구려 무용총 방",
                desc: "고구려의 용맹한 기상과 광개토대왕의 영토 확장 비결!",
                hotspots: [
                    { title: "수렵도 벽화", icon: "fa-horse", top: "30%", left: "35%", clueName: "무용총 수렵도", clueText: "말을 타며 활을 쏘는 용맹한 고구려 기상입니다.", eduTip: "고구려 = 기마 민족의 씩씩한 기상" },
                    { title: "광개토대왕릉비", icon: "fa-monument", top: "50%", left: "70%", clueName: "광개토대왕 영토 확장", clueText: "만주 영토를 확장하고 신라를 도와 왜를 격퇴했습니다.", eduTip: "광개토대왕 = 고구려 전성기" },
                    { title: "고구려 철갑 기병", icon: "fa-shield-halved", top: "60%", left: "20%", clueName: "개마무사 정예부대", clueText: "말과 군사 모두 철갑옷을 입은 고구려의 강군입니다.", eduTip: "고구려 5세기 전성기" }
                ],
                puzzles: [
                    { id: "e2_r1_q1", type: "quiz", question: "만주 영토를 크게 넓히고 고구려 5세기 전성기를 연 왕은?", options: ["광개토대왕", "세종대왕", "진흥왕", "근초고왕"], answerIdx: 0, relicName: "광개토대왕릉비", relicDesc: "고구려 성군", eduTip: "영토를 널리 개척한 위대한 왕입니다." },
                    { id: "e2_r1_q2", type: "quiz", question: "광개토대왕의 아들로 수도를 평양으로 옮기고 남진 정책을 추진한 왕은?", options: ["장수왕", "동명성왕", "의자왕", "무열왕"], answerIdx: 0, relicName: "충주 고구려비", relicDesc: "장수왕의 남진정책", eduTip: "장수왕은 남쪽으로 영역을 넓혀 한강 유역을 차지했습니다." },
                    { id: "e2_r1_q3", type: "quiz", question: "고구려를 건국한 인물로 활을 잘 쏘아 '주몽'이라 불린 인물은?", options: ["동명성왕 (주몽)", "온조왕", "박혁거세", "단군왕검"], answerIdx: 0, relicName: "고구려 건국 주몽", relicDesc: "고구려 시조", eduTip: "부여에서 나와 졸본에 고구려를 세웠습니다." },
                    { id: "e2_r1_q4", type: "quiz", question: "수나라 30만 대군을 살수에서 크게 무찌른 고구려의 장수는?", options: ["을지문덕", "강감찬", "이순신", "최무선"], answerIdx: 0, relicName: "살수대첩 을지문덕", relicDesc: "살수대첩", eduTip: "612년 을지문덕 장군이 살수(청천강)에서 대승을 거두었습니다." },
                    { id: "e2_r1_q5", type: "quiz", question: "당나라 태종의 침략에 맞서 안시성을 끝까지 지켜낸 승리는?", options: ["안시성 싸움", "살수대첩", "한산도대첩", "진포대첩"], answerIdx: 0, relicName: "안시성 유적", relicDesc: "안시성 항쟁", eduTip: "양만춘 장군과 안시성 군민들이 당나라 대군을 물리쳤습니다." },
                    { id: "e2_r1_q6", type: "quiz", question: "고구려 무덤 속에 그려진 사신도에 해당하지 않는 신령한 동물은?", options: ["해태", "청룡", "백호", "주작"], answerIdx: 0, relicName: "강서대묘 사신도", relicDesc: "고구려 벽화", eduTip: "사신도 = 청룡(동), 백호(서), 주작(남), 현무(북)" },
                    { id: "e2_r1_q7", type: "quiz", question: "고구려 신라 도울 때 신라 왕에게 보낸 호우명 그릇에 적힌 왕의 이름은?", options: ["광개토대왕", "진흥왕", "무령왕", "공민왕"], answerIdx: 0, relicName: "호우총 호우명 그릇", relicDesc: "고구려와 신라 관계", eduTip: "신라 호우총에서 광개토대왕을 호칭한 글씨가 발견되었습니다." },
                    { id: "e2_r1_q8", type: "quiz", question: "고구려 청소년들에게 학문과 무예를 가르치던 교육 기관은?", options: ["경당", "화랑도", "집현전", "서당"], answerIdx: 0, relicName: "고구려 경당", relicDesc: "지방 교육 기관", eduTip: "태학과 함께 고구려 인재를 양성했습니다." },
                    { id: "e2_r1_q9", type: "quiz", question: "고구려 정예 기병인 개마무사의 뜻은?", options: ["말과 군사 모두 철갑옷을 입은 기병", "칼을 두 개 차고 다니는 군사", "바다에서 싸우는 수군", "활만 전담해서 쏘는 기병"], answerIdx: 0, relicName: "개마무사 모형", relicDesc: "고구려 철갑기병", eduTip: "말까지 철갑으로 무장한 최강 기병 부대입니다." },
                    { id: "e2_r1_q10", type: "quiz", question: "고구려의 험준한 산세를 이용해 쌓은 대표적인 산성은?", options: ["오녀산성(흘승골성)", "수원화성", "남한산성", "행주산성"], answerIdx: 0, relicName: "오녀산성", relicDesc: "고구려 산성", eduTip: "고구려는 산성을 기반으로 강한 방어력을 갖추었습니다." }
                ]
            },
            {
                name: "2번 방: 백제 무령왕릉 왕실",
                desc: "백제 무령왕릉과 아름다운 금동대향로의 비밀!",
                hotspots: [
                    { title: "무령왕릉 지석", icon: "fa-certificate", top: "40%", left: "30%", clueName: "무덤 주인의 지석", clueText: "무덤 주인이 백제 무령왕임을 증명해 준 돌입니다.", eduTip: "백제 무령왕릉 = 벽돌무덤 양식" },
                    { title: "백제 금동대향로", icon: "fa-spa", top: "55%", left: "60%", clueName: "금동대향로 공예", clueText: "봉황, 연꽃, 악사가 조각된 백제 최고의 공예품입니다.", eduTip: "백제 = 세련되고 우아한 문화" },
                    { title: "무령왕 금제 관장식", icon: "fa-crown", top: "30%", left: "75%", clueName: "왕과 왕비 관장식", clueText: "금으로 화려하게 꽃 모양을 조각한 백제 관장식입니다.", eduTip: "백제 예술의 정수" }
                ],
                puzzles: [
                    { id: "e2_r2_q1", type: "quiz", question: "무덤의 주인이 기록된 돌(지석)이 발견되어 알려진 백제의 왕릉은?", options: ["무령왕릉", "황남대총", "장군총", "천마총"], answerIdx: 0, relicName: "무령왕릉 지석", relicDesc: "백제 왕릉", eduTip: "중국 남조 스타일의 벽돌무덤입니다." },
                    { id: "e2_r2_q2", type: "quiz", question: "백제 4세기 전성기를 이끌고 마한을 정복하며 한강 유역을 다스린 왕은?", options: ["근초고왕", "무령왕", "성왕", "의자왕"], answerIdx: 0, relicName: "칠지도", relicDesc: "근초고왕 전성기", eduTip: "근초고왕 때 백제는 요서 지방과 일본 규슈까지 진출했습니다." },
                    { id: "e2_r2_q3", type: "quiz", question: "백제 근초고왕이 왜(일본) 왕에게 전해준 일곱 갈래 칼의 이름은?", options: ["칠지도", "비파형 동검", "환두대도", "사인검"], answerIdx: 0, relicName: "백제 칠지도", relicDesc: "칠지도", eduTip: "백제와 일본의 활발한 교류를 증명합니다." },
                    { id: "e2_r2_q4", type: "quiz", question: "백제를 건국한 주몽의 아들이자 한강 유역 위례성에 도읍을 정한 인물은?", options: ["온조왕", "비류", "박혁거세", "김수로"], answerIdx: 0, relicName: "서울 몽촌토성", relicDesc: "백제 건국", eduTip: "고구려에서 남하한 온조가 백제를 세웠습니다." },
                    { id: "e2_r2_q5", type: "quiz", question: "백제의 뛰어난 금속 공예 기술과 도교·불교 사상을 보여주는 대표 유물은?", options: ["백제 금동대향로", "석가탑", "고려청자", "빗살무늬토기"], answerIdx: 0, relicName: "백제 금동대향로", relicDesc: "백제 공예품", eduTip: "부여 능산리 사지에서 발견되었습니다." },
                    { id: "e2_r2_q6", type: "quiz", question: "백제 성왕이 수도를 사비(부여)로 옮기고 국호를 무엇으로 바꾸었는가?", options: ["남부여", "대백제", "후백제", "마한"], answerIdx: 0, relicName: "부여 정림사지 5층석탑", relicDesc: "사비 시대 백제", eduTip: "성왕은 백제의 중흥을 꿈꾸며 사비로 수도를 옮겼습니다." },
                    { id: "e2_r2_q7", type: "quiz", question: "익산에 미륵사를 창건하고 서동요 신화로 유명한 백제의 왕은?", options: ["무왕", "근초고왕", "의자왕", "개로왕"], answerIdx: 0, relicName: "익산 미륵사지 석탑", relicDesc: "무왕과 미륵사", eduTip: "미륵사지 석탑은 한국에서 가장 오래된 석탑입니다." },
                    { id: "e2_r2_q8", type: "quiz", question: "백제 계백 장군이 5천 결사대로 신라 김유신 부대에 맞서 싸운 전투는?", options: ["황산벌 전투", "살수대첩", "안시성 전투", "매소성 전투"], answerIdx: 0, relicName: "황산벌 전투 유적", relicDesc: "계백 장군", eduTip: "660년 계백 장군이 백제의 마지막 충절을 바쳤습니다." },
                    { id: "e2_r2_q9", type: "quiz", question: "백제 문화의 특징을 가장 잘 표현한 단어 조합은?", options: ["검소하지만 누추하지 않고 화려하지만 사치스럽지 않다", "웅장하고 호방하다", "실용적이고 기계적이다", "단순하고 거칠다"], answerIdx: 0, relicName: "백제 금제 관장식", relicDesc: "백제 미학", eduTip: "검이불루 화이불치(儉而不陋 華而不侈)의 미학입니다." },
                    { id: "e2_r2_q10", type: "quiz", question: "백제 사람들이 일본에 문화를 전해준 인물이 아닌 것은?", options: ["최무선", "아직기", "왕인", "노리사치계"], answerIdx: 0, relicName: "왕인 박사 유적", relicDesc: "일본 문화 전파", eduTip: "왕인은 천자문과 논어를, 노리사치계는 불경을 전했습니다." }
                ]
            },
            {
                name: "3번 방: 통일신라 서라벌 불국사",
                desc: "신라의 삼국통일과 세계 최고의 목판 인쇄물 석가탑 유물!",
                hotspots: [
                    { title: "불국사 석가탑", icon: "fa-gopuram", top: "35%", left: "30%", clueName: "세계 최고 목판 인쇄물", clueText: "석가탑에서 무구정광대다라니경이 발견되었습니다.", eduTip: "세계 최초 목판 인쇄본 발견" },
                    { title: "첨성대 별자리 지도", icon: "fa-star", top: "50%", left: "70%", clueName: "동양 최초 천문대 첨성대", clueText: "선덕여왕 때 만든 동양 가장 오래된 천문대입니다.", eduTip: "첨성대 = 신라의 별 관측소" },
                    { title: "삼국통일 신문왕 서찰", icon: "fa-shield", top: "65%", left: "45%", clueName: "신라의 삼국통일 완성", clueText: "676년 당나라를 물리치고 삼국통일을 이뤘습니다.", eduTip: "신라 삼국통일 = 문화 융합" }
                ],
                puzzles: [
                    { id: "e2_r3_q1", type: "quiz", question: "신라 선덕여왕 때 하늘과 별자리를 관측하기 위해 세운 천문대는?", options: ["첨성대", "자격루", "앙부일구", "측우기"], answerIdx: 0, relicName: "첨성대", relicDesc: "동양 최초 천문대", eduTip: "국보로 지정된 경주의 자랑스러운 유산입니다." },
                    { id: "e2_r3_q2", type: "quiz", question: "신라 석가탑 해체 보수 중 발견된 세계에서 가장 오래된 목판 인쇄물은?", options: ["무구정광대다라니경", "직지심체요절", "팔만대장경", "훈민정음"], answerIdx: 0, relicName: "무구정광대다라니경", relicDesc: "세계 최동 목판인쇄", eduTip: "신라의 뛰어난 인쇄와 종이(한지) 기술을 증명합니다." },
                    { id: "e2_r3_q3", type: "quiz", question: "신라 청소년들이 학문과 무예를 닦아 인재로 성장하던 조직은?", options: ["화랑도", "경당", "집현전", "독립협회"], answerIdx: 0, relicName: "신라 화랑도", relicDesc: "화랑과 원화", eduTip: "김유신, 관창 등이 화랑 출신입니다." },
                    { id: "e2_r3_q4", type: "quiz", question: "신라가 나당 전쟁에서 당나라 대군을 물리친 대표적인 두 전투는?", options: ["매소성 전투와 기벌포 해전", "살수대첩과 안시성 전투", "한산도 대첩과 명량 대첩", "진포 대첩과 관산성 전투"], answerIdx: 0, relicName: "매소성 기벌포 유적", relicDesc: "삼국통일 완성", eduTip: "676년 기벌포 해전 승리로 삼국통일을 완수했습니다." },
                    { id: "e2_r3_q5", type: "quiz", question: "통일신라 시대 완도에 청해진을 설치하고 해상 무역을 지배한 인물은?", options: ["장보고", "김유신", "원효대사", "최치원"], answerIdx: 0, relicName: "완도 청해진 유적", relicDesc: "해상왕 장보고", eduTip: "장보고는 동아시아 해상권을 장악한 해상왕입니다." },
                    { id: "e2_r3_q6", type: "quiz", question: "신라 진흥왕이 영토를 넓힌 뒤 순수하고 비석을 세운 4곳에 포함되지 않는 것은?", options: ["독립문비", "북한산비", "창녕비", "황초령비"], answerIdx: 0, relicName: "북한산 진흥왕 순수비", relicDesc: "진흥왕 영토 확장", eduTip: "북한산, 창녕, 황초령, 마운령에 순수비를 세웠습니다." },
                    { id: "e2_r3_q7", type: "quiz", question: "통일신라 시대 토함산에 조성된 세계적인 인공 굴 불교 유산은?", options: ["석굴암", "무령왕릉", "고인돌", "팔만대장경판전"], answerIdx: 0, relicName: "경주 석굴암", relicDesc: "세계유산 석굴암", eduTip: "김대성이 창건한 석굴암 본존불은 신라 조각의 정수입니다." },
                    { id: "e2_r3_q8", type: "quiz", question: "해해 해골물을 마시고 '모든 것은 마음먹기에 달렸다'는 깨달음을 얻은 신라의 승려는?", options: ["원효대사", "의상대사", "혜초", "도선국사"], answerIdx: 0, relicName: "원효대사 일체유심조", relicDesc: "원효대사", eduTip: "원효는 불교 대중화에 큰 공헌을 했습니다." },
                    { id: "e2_r3_q9", type: "quiz", question: "신라 승려 혜초가 인도와 서역을 여행하고 남긴 기행문의 이름은?", options: ["왕오천축국전", "난중일기", "삼국유사", "동의보감"], answerIdx: 0, relicName: "왕오천축국전", relicDesc: "혜초 기행문", eduTip: "세계 4대 여행기 중 하나로 꼽힙니다." },
                    { id: "e2_r3_q10", type: "quiz", question: "통일신라 시대 당나라 빈공과에 합격하여 '토황소격문'을 쓴 천재 학자는?", options: ["최치원", "정약용", "서재필", "최무선"], answerIdx: 0, relicName: "최치원 문집", relicDesc: "최치원", eduTip: "신라 6두품 출신의 대표 학자입니다." }
                ]
            }
        ]
    },
    3: {
        eraName: "고려시대",
        bgImg: "images/goryeo_village.jpg",
        rooms: [
            {
                name: "1번 방: 개경 벽란도 무역선",
                desc: "코리아(Korea)의 이름을 알린 고려의 국제 무역 항구 벽란도!",
                hotspots: [
                    { title: "벽란도 항구 지도", icon: "fa-anchor", top: "40%", left: "25%", clueName: "국제 무역항 벽란도", clueText: "예성강 하구의 벽란도에는 송, 아라비아 상인이 출입했습니다.", eduTip: "Goryeo ➔ Korea 명칭 유래" },
                    { title: "고려 상감청자", icon: "fa-whiskey-glass", top: "55%", left: "60%", clueName: "고려 상감청자", clueText: "비색 푸른빛과 흑백 무늬를 파내는 상감 기법 도자기입니다.", eduTip: "고려의 독창적 공예 기술" },
                    { title: "아라비아 상인 선물함", icon: "fa-box-open", top: "30%", left: "80%", clueName: "수출품 고려인삼", clueText: "인삼, 종이, 모시를 수출하고 향료와 수은을 수입했습니다.", eduTip: "고려인삼 = 세계 명품" }
                ],
                puzzles: [
                    { id: "e3_r1_q1", type: "quiz", question: "아라비아 상인들이 오가며 세계에 '코리아(Korea)'를 알린 고려 무역항은?", options: ["벽란도", "부산항", "인천항", "울산항"], answerIdx: 0, relicName: "벽란도 지도", relicDesc: "고려 무역항", eduTip: "예성강 하구의 국제 무역 항구입니다." },
                    { id: "e3_r2_q2", type: "quiz", question: "고려를 건국하고 신라와 후백제를 통합하여 후삼국을 통일한 왕은?", options: ["태조 왕건", "공민왕", "광종", "성종"], answerIdx: 0, relicName: "고려 태조 왕건 동상", relicDesc: "고려 건국자", eduTip: "918년 고려를 세우고 936년 후삼국을 통일했습니다." },
                    { id: "e3_r1_q3", type: "quiz", question: "고려 도자기 중 표면에 문양을 파내고 흙을 채워 넣는 독창적 기법은?", options: ["상감 기법", "빗살무늬 기법", "유리 기법", "칠보 기법"], answerIdx: 0, relicName: "청자 상감운학문 매병", relicDesc: "상감청자", eduTip: "고려 비색 상감청자는 세계적인 예술품입니다." },
                    { id: "e3_r1_q4", type: "quiz", question: "거란의 1차 침입 때 뛰어난 말재주(외교 담판)로 강동 6주를 얻어낸 위인은?", options: ["서희", "강감찬", "최무선", "을지문덕"], answerIdx: 0, relicName: "강동 6주 지도", relicDesc: "서희의 외교 담판", eduTip: "서희는 피 한 방울 흘리지 않고 강동 6주를 획득했습니다." },
                    { id: "e3_r1_q5", type: "quiz", question: "거란의 3차 침입 때 귀주에서 거란 대군을 몰살시킨 대승리는?", options: ["귀주 대첩 (강감찬)", "살수 대첩", "한산도 대첩", "진포 대첩"], answerIdx: 0, relicName: "강감찬 귀주대첩비", relicDesc: "귀주대첩", eduTip: "1019년 강감찬 장군이 귀주에서 대승을 거두었습니다." },
                    { id: "e3_r1_q6", type: "quiz", question: "고려 시대 화폐로 만들어진 은으로 만든 항아리 모양의 돈은?", options: ["은병 (활구)", "상평통보", "조선통보", "비트코인"], answerIdx: 0, relicName: "고려 은병", relicDesc: "고려 화폐", eduTip: "고려 지형을 닮아 활구라고도 불렸습니다." },
                    { id: "e3_r1_q7", type: "quiz", question: "고려 태조 왕건이 후대 왕들에게 남긴 10가지 가르침의 이름은?", options: ["훈요 10조", "8조법", "시무 28조", "홍익인간"], answerIdx: 0, relicName: "훈요 10조 기록", relicDesc: "왕건의 유훈", eduTip: "불교를崇尙하고 거란을 경계하라고 가르쳤습니다." },
                    { id: "e3_r1_q8", type: "quiz", question: "고려 시대 국립 교육 기관으로 인재를 양성하던 학교는?", options: ["국자감", "태학", "성균관", "경당"], answerIdx: 0, relicName: "고려 국자감", relicDesc: "고려 유학 교육", eduTip: "개경에 설치된 최고 교육 기관입니다." },
                    { id: "e3_r1_q9", type: "quiz", question: "고려에 침입하여 강화도로 도읍을 옮기게 만든 몽골(원나라)에 맞선 무신 정권 부대는?", options: ["삼별초", "화랑도", "의병", "독립군"], answerIdx: 0, relicName: "삼별초 유적", relicDesc: "삼별초 항쟁", eduTip: "진도와 제주도로 옮겨가며 끝까지 항전했습니다." },
                    { id: "e3_r1_q10", type: "quiz", question: "고려의 대표적 수출품 중 외국 상인들에게 인기가 높았던 약재는?", options: ["고려인삼", "담배", "고추", "옥수수"], answerIdx: 0, relicName: "고려인삼", relicDesc: "고려 명품 특산물", eduTip: "고려인삼의 우수한 효능은 세계에 알려졌습니다." }
                ]
            },
            {
                name: "2번 방: 팔만대장경 판전",
                desc: "몽골 침입에 맞선 팔만대장경과 세계 최초 금속활자 직지!",
                hotspots: [
                    { title: "팔만대장경 판전", icon: "fa-book-atlas", top: "35%", left: "30%", clueName: "팔만대장경판", clueText: "몽골 침입을 부처님 힘으로 극복하고자 8만 여 장을 새겼습니다.", eduTip: "해인사 장경판전 = 유네스코 세계유산" },
                    { title: "직지심체요절", icon: "fa-print", top: "60%", left: "55%", clueName: "세계 최초 금속활자 직지", clueText: "1377년 청주 흥덕사에서 인쇄된 세계 최초 금속활자본입니다.", eduTip: "독일 구텐베르크보다 78년 앞섬" },
                    { title: "삼별초 깃발", icon: "fa-flag", top: "45%", left: "80%", clueName: "삼별초의 대몽 항쟁", clueText: "강화도, 진도, 제주도로 이동하며 몽골에 끝까지 항쟁했습니다.", eduTip: "삼별초 = 고려의 자주 의지" }
                ],
                puzzles: [
                    { id: "e3_r2_q1", type: "quiz", question: "세계에서 가장 오래된 금속활자 인쇄본으로 유네스코 기록유산인 고려의 책은?", options: ["직지심체요절", "조선왕조실록", "동의보감", "삼국사기"], answerIdx: 0, relicName: "직지심체요절", relicDesc: "세계 최고 금속활자", eduTip: "1377년 청주 흥덕사에서 인쇄되었습니다." },
                    { id: "e3_r2_q2", type: "quiz", question: "몽골의 침입을 부처님의 힘으로 물리치기 위해 합천 해인사에 보관한 유산은?", options: ["팔만대장경", "석가탑", "무령왕릉 지석", "훈민정음 해례본"], answerIdx: 0, relicName: "팔만대장경판", relicDesc: "고려 대장경", eduTip: "8만 1,258장의 목판으로 이루어져 있습니다." },
                    { id: "e3_r2_q3", type: "quiz", question: "고려 유학자 김부식이 왕명으로 편찬한 우리나라에서 가장 오래된 역사책은?", options: ["삼국사기", "삼국유사", "동의보감", "난중일기"], answerIdx: 0, relicName: "삼국사기", relicDesc: "가장 오래된 정사", eduTip: "유교적 관점에서 삼국의 역사를 기록했습니다." },
                    { id: "e3_r2_q4", type: "quiz", question: "승려 일연이 삼국의 야사와 단군 신화를 포함하여 편찬한 역사책은?", options: ["삼국유사", "삼국사기", "조선왕조실록", "독립신문"], answerIdx: 0, relicName: "삼국유사", relicDesc: "단군 신화 수록", eduTip: "단군 신화가 최초로 수록된 책입니다." },
                    { id: "e3_r2_q5", type: "quiz", question: "팔만대장경을 보관하는 합천 해인사 장경판전의 과학적 특징은?", options: ["바람과 습도가 자연적으로 통풍되게 설계됨", "지하 깊은 곳에 묻어둠", "돌로 밀폐시킴", "에어컨을 설치함"], answerIdx: 0, relicName: "해인사 장경판전", relicDesc: "자연 통풍 과학", eduTip: "창문의 크기를 상하 다르게 만들어 바람이 순환합니다." },
                    { id: "e3_r2_q6", type: "quiz", question: "몽골의 2차 침입 때 처인성에서 몽골 장수 살리타를 화살로 쏘아 맞힌 위인은?", options: ["김윤후", "강감찬", "최무선", "이순신"], answerIdx: 0, relicName: "처인성 승첩비", relicDesc: "김윤후 승려", eduTip: "승려 김윤후와 처인성 부곡민들이 대승을 거두었습니다." },
                    { id: "e3_r2_q7", type: "quiz", question: "고려 무신 정권 당시 강화도로 수도를 옮긴(강도 이도) 이유는?", options: ["몽골군이 수전에 약했기 때문에", "경치가 좋아서", "중국과 가까워서", "농사가 잘 되어서"], answerIdx: 0, relicName: "강화 고려궁지", relicDesc: "강화도 수전 방어", eduTip: "바다 건너 섬인 강화도에서 장기 항전을 도모했습니다." },
                    { id: "e3_r2_q8", type: "quiz", question: "고려 여성들이 몽골에 공녀로 끌려가거나 원나라 관습이 유행한 현상은?", options: ["몽골풍 유행", "한류 유행", "왜풍 유행", "유교 유행"], answerIdx: 0, relicName: "고려 족두리와 연지곤지", relicDesc: "몽골풍", eduTip: "족두리, 연지곤지, 족발 등이 몽골의 영향을 받았습니다." },
                    { id: "e3_r2_q9", type: "quiz", question: "고려 목판 인쇄술의 발달을 증명하는 유산이 아닌 것은?", options: ["독립문", "초조대장경", "팔만대장경", "무구정광대다라니경"], answerIdx: 0, relicName: "고려 목판 인쇄", relicDesc: "목판 인쇄 문화", eduTip: "독립문은 근대 석조 건물입니다." },
                    { id: "e3_r2_q10", type: "quiz", question: "고려 충선왕 때 만권당에서 원나라 학자들과 교류한 고려 유학자는?", options: ["이제현", "정도전", "정몽주", "김부식"], answerIdx: 0, relicName: "이제현 초상", relicDesc: "만권당 학자", eduTip: "성리학을 고려에 보급하는 계기가 되었습니다." }
                ]
            },
            {
                name: "3번 방: 화통도감 최무선 방",
                desc: "화약을 개발하여 왜구를 물리친 최무선의 비밀 무기!",
                hotspots: [
                    { title: "화약 제조 장부", icon: "fa-flask-vial", top: "40%", left: "25%", clueName: "화약 개발 최무선", clueText: "염초 기술을 배워 고려 최초로 화약을 개발했습니다.", eduTip: "화통도감 설치 ➔ 화약 무기 제작" },
                    { title: "진포 대첩 해전도", icon: "fa-explosion", top: "55%", left: "65%", clueName: "진포대첩 승리", clueText: "1380년 배에 화포를 장착해 왜구 배 500척을 궤멸시켰습니다.", eduTip: "해전 화포 사용의 세계적 대승" },
                    { title: "공민왕 개혁 칙서", icon: "fa-scroll", top: "30%", left: "75%", clueName: "공민왕 반원 자주 개혁", clueText: "원나라 관습을 폐지하고 땅을 되찾은 개혁 군주입니다.", eduTip: "반원 자주 정책 추진" }
                ],
                puzzles: [
                    { id: "e3_r3_q1", type: "quiz", question: "화약을 개발하고 화통도감을 설치하여 진포 대첩에서 왜구를 격퇴한 인물은?", options: ["최무선", "강감찬", "서희", "을지문덕"], answerIdx: 0, relicName: "화통도감 화포", relicDesc: "최무선 화약 개발", eduTip: "세계 해전사에서 화포를 사용한 최초 승리 중 하나입니다." },
                    { id: "e3_r3_q2", type: "quiz", question: "고려 말 원나라의 간섭에서 벗어나 쌍성총관부를 탈환하고 반원 자주 개혁을 추진한 왕은?", options: ["공민왕", "태조 왕건", "광종", "충렬왕"], answerIdx: 0, relicName: "공민왕과 노국공주 초상", relicDesc: "공민왕 개혁", eduTip: "신돈을 등용해 전민변정도감을 설치했습니다." },
                    { id: "e3_r3_q3", type: "quiz", question: "원나라에서 목화씨를 붓뚜껑에 몰래 숨겨 들어와 옷감 혁명을 일으킨 인물은?", options: ["문익점", "최무선", "정약용", "서재필"], answerIdx: 0, relicName: "문익점 목화씨", relicDesc: "문익점 목화 보급", eduTip: "무명(면직물) 옷을 만들어 백성들이 따뜻한 겨울을 보냈습니다." },
                    { id: "e3_r3_q4", type: "quiz", question: "공민왕 때 억울하게 노비가 된 사람을 해방하고 토지를 돌려주기 위해 설치한 관청은?", options: ["전민변정도감", "화통도감", "집현전", "독립협회"], answerIdx: 0, relicName: "전민변정도감 기록", relicDesc: "신돈과 전민변정도감", eduTip: "권문세족의 약탈을 막고 백성을 구제하려 했습니다." },
                    { id: "e3_r3_q5", type: "quiz", question: "고려 말 신흥 무인 세력으로 왜구와 여진족을 무찌르며 성정한 두 영웅은?", options: ["이성계와 최영", "김유신과 계백", "이순신과 권율", "강감찬과 서희"], answerIdx: 0, relicName: "이성계 황산대첩비", relicDesc: "신흥 무인 세력", eduTip: "이성계는 황산대첩에서 왜구를 소탕했습니다." },
                    { id: "e3_r3_q6", type: "quiz", question: "고려 말 성리학을 도입하고 개혁을 주장한 새로운 관료 세력의 명칭은?", options: ["신진사대부", "권문세족", "6두품", "화랑"], answerIdx: 0, relicName: "고려 신진사대부 문집", relicDesc: "신진사대부", eduTip: "정도전, 정몽주 등이 대표적 신진사대부입니다." },
                    { id: "e3_r3_q7", type: "quiz", question: "이성계가 위화도에서 군사를 돌려 정권을 잡은 사건은?", options: ["위화도 회군 (1388년)", "살수 대첩", "삼일 운동", "6월 민주 항쟁"], answerIdx: 0, relicName: "위화도 회군 지도", relicDesc: "위화도 회군", eduTip: "조선 건국의 결정적 계기가 되었습니다." },
                    { id: "e3_r3_q8", type: "quiz", question: "고려에 끝까지 충성을 바치며 '단심가'를 남기고 선죽교에서 서거한 위인은?", options: ["정몽주", "정도전", "이성계", "최영"], answerIdx: 0, relicName: "정몽주 선죽교 유적", relicDesc: "정몽주 단심가", eduTip: "이몸이 죽고 죽어 일백 번 고쳐 죽어..." },
                    { id: "e3_r3_q9", type: "quiz", question: "이성계를 도와 조선 건국의 제도적 기틀을 마련하고 '조선경국전'을 쓴 인물은?", options: ["정도전", "정몽주", "이방원", "최무선"], answerIdx: 0, relicName: "정도전 조선경국전", relicDesc: "정도전", eduTip: "한양 수도 설계와 조선의 기틀을 잡았습니다." },
                    { id: "e3_r3_q10", type: "quiz", question: "최무선이 만든 화약 무기가 배치되어 전투를 펼치던 관청은?", options: ["화통도감", "군기시", "집현전", "규장각"], answerIdx: 0, relicName: "화통도감 화포 모형", relicDesc: "화통도감", eduTip: "1377년 최무선의 건의로 설치되었습니다." }
                ]
            }
        ]
    },
    4: {
        eraName: "조선시대",
        bgImg: "images/joseon_village.jpg",
        rooms: [
            {
                name: "1번 방: 집현전 비밀 서재",
                desc: "세종대왕의 훈민정음 창제와 해시계, 물시계의 비밀!",
                hotspots: [
                    { title: "훈민정음 해례본", icon: "fa-language", top: "35%", left: "30%", clueName: "훈민정음 창제", clueText: "세종대왕이 1443년 창제하고 1446년 반포한 우리 글자입니다.", eduTip: "훈민정음 = 백성을 가르치는 바른 소리" },
                    { title: "앙부일구 해시계", icon: "fa-clock", top: "60%", left: "60%", clueName: "오목 해시계 앙부일구", clueText: "해 그림자로 시간과 절기를 측정하던 과학 도구입니다.", eduTip: "앙부일구, 자격루, 측우기 세종대 과학" },
                    { title: "자모음 수량 서찰", icon: "fa-envelope-open-text", top: "45%", left: "80%", clueName: "창제 당시 글자 수 (28자)", clueText: "창제 당시 자음 17자 + 모음 11자로 총 28자였습니다.", eduTip: "훈민정음 창제 28자" }
                ],
                puzzles: [
                    { id: "e4_r1_q1", type: "digit", question: "세종대왕께서 백성을 위해 창제하신 훈민정음의 처 처음 글자 수는 총 몇 자(숫자)였을까요?", answer: "28", relicName: "훈민정음 해례본", relicDesc: "훈민정음 28자", eduTip: "현재는 24자를 사용하고 있습니다." },
                    { id: "e4_r1_q2", type: "quiz", question: "1446년 세종대왕이 '백성을 가르치는 바른 소리'라는 뜻으로 반포한 우리 글은?", options: ["훈민정음", "이두", "향찰", "한문"], answerIdx: 0, relicName: "훈민정음 선언문", relicDesc: "훈민정음", eduTip: "유네스코 세계기록유산으로 등재되어 있습니다." },
                    { id: "e4_r1_q3", type: "quiz", question: "세종대왕 때 장영실 등이 만든 오목한 그릇 모양의 해시계 이름은?", options: ["앙부일구", "자격루", "측우기", "혼천의"], answerIdx: 0, relicName: "앙부일구", relicDesc: "조선 해시계", eduTip: "시전 거리에 설치하여 백성들이 시각을 알게 했습니다." },
                    { id: "e4_r1_q4", type: "quiz", question: "자동으로 종이 울려 시간을 알려주던 조선 세종 때의 물시계는?", options: ["자격루", "앙부일구", "측우기", "거중기"], answerIdx: 0, relicName: "자격루 모형", relicDesc: "조선 자동 물시계", eduTip: "장영실이 제작한 정교한 자동 시계입니다." },
                    { id: "e4_r1_q5", type: "quiz", question: "세계 최초로 비의 양을 측정하기 위해 조선 세종 때 제작한 도구는?", options: ["측우기", "앙부일구", "자격루", "화포"], answerIdx: 0, relicName: "측우기", relicDesc: "세계 최초 강우량계", eduTip: "이탈리아의 강우량계보다 200년이나 앞섰습니다." },
                    { id: "e4_r1_q6", type: "quiz", question: "세종대왕이 학문과 인재 양성을 위해 궁궐 안에 설치한 연구 기관은?", options: ["집현전", "규장각", "국자감", "독립협회"], answerIdx: 0, relicName: "집현전 학자들", relicDesc: "집현전", eduTip: "신숙주, 성삼문 등의 학자들이 연구했습니다." },
                    { id: "e4_r1_q7", type: "quiz", question: "조선 세종 때 김종서와 최윤덕이 여진과 야인을 물리치고 개척한 영토는?", options: ["4군 6진", "강동 6주", "독도", "탐라국"], answerIdx: 0, relicName: "4군 6진 지도", relicDesc: "압록강 두만강 국경선", eduTip: "현재 대한민국의 압록강~두만강 국경선이 완성되었습니다." },
                    { id: "e4_r1_q8", type: "quiz", question: "노비 출신이었으나 뛰어난 재능으로 세종대왕에 의해 발탁된 과학 천재는?", options: ["장영실", "정약용", "최무선", "문익점"], answerIdx: 0, relicName: "장영실 과학 도구", relicDesc: "장영실", eduTip: "신분을 뛰어넘은 세종대왕의 인재 등용입니다." },
                    { id: "e4_r1_q9", type: "quiz", question: "조선 왕들의 말과 행동, 국정을 매일 상세히 기록한 세계기록유산은?", options: ["조선왕조실록", "삼국사기", "난중일기", "동의보감"], answerIdx: 0, relicName: "조선왕조실록", relicDesc: "조선왕조실록", eduTip: "사관들이 객관적으로 기록하여 왕도 함부로 못 보았습니다." },
                    { id: "e4_r1_q10", type: "quiz", question: "조선 시대 한양을 둘러싼 4대문 중 남쪽에 위치한 숭례문의 다른 이름은?", options: ["남대문", "동대문", "서대문", "숙정문"], answerIdx: 0, relicName: "숭례문(남대문)", relicDesc: "조선 4대문", eduTip: "숭례문은 국보 1호입니다." }
                ]
            },
            {
                name: "2번 방: 한양 저잣거리 주막",
                desc: "임진왜란의 성웅 이순신 장군과 거북선의 비밀!",
                hotspots: [
                    { title: "난중일기 서책", icon: "fa-book-journal-whills", top: "35%", left: "25%", clueName: "난중일기 기록", clueText: "이순신 장군이 임진왜란 7년 동안 기록한 세계기록유산입니다.", eduTip: "23전 23승 전승 신화" },
                    { title: "거북선 수조 모형", icon: "fa-ship", top: "55%", left: "55%", clueName: "조선 돌격선 거북선", clueText: "송못을 꽂고 용머리에서 포를 쏘는 조선 해군의 무기입니다.", eduTip: "한산도대첩 학익진 전술" },
                    { title: "의병장의 붉은 옷", icon: "fa-shirt", top: "40%", left: "80%", clueName: "홍의장군 곽재우 의병", clueText: "전국에서 민중들이 자발적으로 나라를 구하러 일어났습니다.", eduTip: "관군 + 해군 + 의병의 극복" }
                ],
                puzzles: [
                    { id: "e4_r2_q1", type: "quiz", question: "한산도 대첩, 명량 대첩, 노량 대첩을 이끌어 임진왜란에서 나라를 구한 성웅은?", options: ["이순신", "권율", "김시민", "계백"], answerIdx: 0, relicName: "이순신 난중일기", relicDesc: "충무공 이순신", eduTip: "23전 23승 무패의 성웅입니다." },
                    { id: "e4_r2_q2", type: "quiz", question: "1592년 일본(토요토미 히데요시)이 조선을 침략하여 일어난 난의 이름은?", options: ["임진왜란", "병자호란", "정묘호란", "묘청의 난"], answerIdx: 0, relicName: "임진왜란 기록화", relicDesc: "임진왜란", eduTip: "7년 동안 계속된 잔혹한 전쟁이었습니다." },
                    { id: "e4_r2_q3", type: "quiz", question: "이순신 장군이 12척의 배로 133척의 왜선에 맞서 기적의 승리를 거둔 해전은?", options: ["명량 대첩", "한산도 대첩", "노량 대첩", "옥포 해전"], answerIdx: 0, relicName: "명량대첩비", relicDesc: "신에게는 아직 12척의 배가 남아있사옵니다", eduTip: "울돌목의 험한 뱃길 지형을 이용했습니다." },
                    { id: "e4_r2_q4", type: "quiz", question: "행주산성에서 부녀자들과 군민들이 붉은 치마로 돌을 날라 왜구를 격퇴한 전투는?", options: ["행주 대첩 (권율)", "진주 대첩 (김시민)", "한산도 대첩", "살수 대첩"], answerIdx: 0, relicName: "행주대첩비", relicDesc: "권율 장군", eduTip: "임진왜란 3대 대첩 중 하나입니다." },
                    { id: "e4_r2_q5", type: "quiz", question: "임진왜란 때 붉은 옷을 입고 유격전으로 왜구를 무찌른 의병장의 별명은?", options: ["홍의장군 (곽재우)", "충무공", "을지문덕", "김유신"], answerIdx: 0, relicName: "곽재우 장군 유물", relicDesc: "의병장 곽재우", eduTip: "낙동강 일대에서 왜구를 괴롭혔습니다." },
                    { id: "e4_r2_q6", type: "quiz", question: "광해군 때 특산물 대신 쌀이나 베, 돈으로 세금을 바치게 한 개혁 제도는?", options: ["대동법", "영정법", "균역법", "과전법"], answerIdx: 0, relicName: "대동법 선혜청", relicDesc: "대동법", eduTip: "방납의 폐단을 막고 백성의 부담을 줄였습니다." },
                    { id: "e4_r2_q7", type: "quiz", question: "1636년 청나라의 침략으로 인조가 남한산성에서 항전하다 삼전도에서 수치를 당한 난은?", options: ["병자호란", "임진왜란", "정묘호란", "홍경래의 난"], answerIdx: 0, relicName: "남한산성", relicDesc: "병자호란", eduTip: "남한산성에 갇혀 45일간 항전했습니다." },
                    { id: "e4_r2_q8", type: "quiz", question: "조선 허준 선생이 중국과 조선의 의학을 집대성하여 쓴 세계기록유산 의서는?", options: ["동의보감", "난중일기", "조선경국전", "목민심서"], answerIdx: 0, relicName: "동의보감", relicDesc: "허준 동의보감", eduTip: "백성들이 쉽게 구할 수 있는약재를 수록했습니다." },
                    { id: "e4_r2_q9", type: "quiz", question: "조선시대 백성들의 생활과 풍속을 유쾌하게 그린 풍속화의 두 대가는?", options: ["김홍도와 신윤복", "솔거와 안견", "강희안과 정선", "이중섭과 박수근"], answerIdx: 0, relicName: "김홍도 서당도", relicDesc: "조선 풍속화", eduTip: "서민들의 삶과 해학을 화폭에 담았습니다." },
                    { id: "e4_r2_q10", type: "quiz", question: "조선 후기 우리나라 산천을 직접 답사하여 그린 '진경산수화'의 대가는?", options: ["정선 (겸재 정선)", "김홍도", "신윤복", "안견"], answerIdx: 0, relicName: "인왕제색도", relicDesc: "진경산수화", eduTip: "인왕제색도와 금강전도를 그렸습니다." }
                ]
            },
            {
                name: "3번 방: 수원화성 비밀 성문",
                desc: "조선 정조의 수원화성 건설과 정약용의 거중기!",
                hotspots: [
                    { title: "수원화성 성곽도", icon: "fa-chess-rook", top: "30%", left: "30%", clueName: "정조의 수원화성", clueText: "탕평책을 펼치고 효심과 군사 개혁으로 축조한 성곽입니다.", eduTip: "수원화성 = 유네스코 세계유산" },
                    { title: "정약용의 거중기", icon: "fa-gear", top: "55%", left: "65%", clueName: "정약용 거중기 발명", clueText: "도르래 원리를 이용해 공사 기간을 크게 단축했습니다.", eduTip: "도르래 원리 ➔ 공사비 단축" },
                    { title: "규장각 학문 서적", icon: "fa-book", top: "45%", left: "80%", clueName: "학문 지원 규장각", clueText: "인재를 양성하고 실학자들의 학문을 지원한 기관입니다.", eduTip: "영조·정조 = 조선 후기 탕평책" }
                ],
                puzzles: [
                    { id: "e4_r3_q1", type: "quiz", question: "도르래의 원리를 이용해 무거운 돌을 들어올려 수원화성을 축조하는 데 쓰인 도구는?", options: ["거중기", "측우기", "앙부일구", "화통도감"], answerIdx: 0, relicName: "정약용 거중기", relicDesc: "정약용 거중기", eduTip: "정약용이 중국의 기기와 도르래 원리를 응용했습니다." },
                    { id: "e4_r3_q2", type: "quiz", question: "탕평책을 펼치고 규장각을 설치하며 수원화성을 신도시로 건설한 조선의 개혁 군주는?", options: ["정조", "영조", "세종", "태종"], answerIdx: 0, relicName: "정조 어진", relicDesc: "정조대왕", eduTip: "조선 후기 문화 부흥기를 이끌었습니다." },
                    { id: "e4_r3_q3", type: "quiz", question: "정약용이 목민관(고을 수령)이 지켜야 할 자세와 행정을 적은 책은?", options: ["목민심서", "동의보감", "경국대전", "조선경국전"], answerIdx: 0, relicName: "목민심서", relicDesc: "정약용 목민심서", eduTip: "청렴과 애민 정신을 강조했습니다." },
                    { id: "e4_r3_q4", type: "quiz", question: "조선 영조와 정조가 당파 싸움을 막고 인재를 골고루 등용하기 위해 실시한 정책은?", options: ["탕평책", "대동법", "신문고", "과전법"], answerIdx: 0, relicName: "탕평비", relicDesc: "탕평책", eduTip: "성균관 입구에 탕평비를 세웠습니다." },
                    { id: "e4_r3_q5", type: "quiz", question: "조선 후기 실생활에 유용한 학문과 연구를 강조한 학풍은?", options: ["실학", "성리학", "훈고학", "불교"], answerIdx: 0, relicName: "실학자들의 저서", relicDesc: "실학", eduTip: "이익, 박지원, 정약용 등이 실학자입니다." },
                    { id: "e4_r3_q6", type: "quiz", question: "조선 시대 전국을 직접 발로 뛰며 대동여지도를 제작한 지리학자는?", options: ["김정호", "정약용", "김홍도", "장영실"], answerIdx: 0, relicName: "대동여지도", relicDesc: "김정호 대동여지도", eduTip: "목판본으로 인쇄하여 보급이 쉽도록 제작했습니다." },
                    { id: "e4_r3_q7", type: "quiz", question: "조선 영조 때 억울한 백성이 붕을 쳐서 임금에게 직접 알리게 한 제도는?", options: ["신문고", "대동법", "탕평책", "집현전"], answerIdx: 0, relicName: "신문고 둥", relicDesc: "신문고", eduTip: "궁궐 문 앞에 신문고 북을 달았습니다." },
                    { id: "e4_r3_q8", type: "quiz", question: "조선 시대 전국 8도 지리 정보를 적은 책인 동국여지승람을 편찬한 왕은?", options: ["성종", "세종", "정조", "태종"], answerIdx: 0, relicName: "동국여지승람", relicDesc: "조선 지리지", eduTip: "조선 성종 때 완성되었습니다." },
                    { id: "e4_r3_q9", type: "quiz", question: "정조의 친위 부대로 수원화성을 지키던 강력한 군사 조직은?", options: ["장용영", "삼별초", "화랑도", "독립군"], answerIdx: 0, relicName: "장용영 군사 유물", relicDesc: "정조 장용영", eduTip: "왕권을 강화하고 화성을 호위했습니다." },
                    { id: "e4_r3_q10", type: "quiz", question: "조선 후기 신분제가 요동치면서 돈을 주고 사들인 양반 족보나 신분 증서는?", options: ["공명첩", "호패", "상평통보", "지석"], answerIdx: 0, relicName: "공명첩", relicDesc: "조선 후기 신분 변화", eduTip: "이름이 비어있는 관직 임명장입니다." }
                ]
            }
        ]
    },
    5: {
        eraName: "근현대 시대",
        bgImg: "images/modern_korea_village.jpg",
        rooms: [
            {
                name: "1번 방: 독립문 암호 통신실",
                desc: "자주 독립을 외친 독립협회와 대한제국 선포의 순간!",
                hotspots: [
                    { title: "독립문 현판", icon: "fa-archway", top: "35%", left: "30%", clueName: "독립협회와 독립문", clueText: "모화관을 헐고 자주 독립 의지로 건립한 화강암 석조 아치문입니다.", eduTip: "독립문 = 파리 승전보 모티브 석조문" },
                    { title: "대한제국 칙서", icon: "fa-crown", top: "55%", left: "60%", clueName: "고종의 대한제국 선포", clueText: "1897년 환구단에서 황제 즉위식을 갖고 대한제국을 선포했습니다.", eduTip: "대한제국 = 최초 황제국 (1897년)" },
                    { title: "독립신문 1호", icon: "fa-newspaper", top: "40%", left: "80%", clueName: "한글 독립신문", clueText: "서재필이 창간한 최초의 민간 한글 신문입니다.", eduTip: "독립신문 = 한글판 & 영문판" }
                ],
                puzzles: [
                    { id: "e5_r1_q1", type: "quiz", question: "1897년 고종 황제가 환구단에서 자주 독립국임을 선포하며 세운 국호는?", options: ["대한제국", "고려국", "조선국", "대한민국"], answerIdx: 0, relicName: "대한제국 칙서", relicDesc: "대한제국 선포", eduTip: "우리 역사상 최초의 황제국입니다." },
                    { id: "e5_r1_q2", type: "quiz", question: "서재필과 민중들이 모화관을 헐고 자주 독립 의지를 담아 건립한 화강암 아치문은?", options: ["독립문", "숭례문", "흥인지문", "광화문"], answerIdx: 0, relicName: "독립문", relicDesc: "화강암 아치 독립문", eduTip: "프랑스 파리 에투알 승전보를 모티브로 건립했습니다." },
                    { id: "e5_r1_q3", type: "quiz", question: "1896년 서재필이 창간한 우리나라 최초의 민간 한글 신문은?", options: ["독립신문", "황성신문", "한성순보", "매일신보"], answerIdx: 0, relicName: "독립신문 1호", relicDesc: "최초 민간 한글신문", eduTip: "누구나 쉽게 읽도록 순한글로 썼습니다." },
                    { id: "e5_r1_q4", type: "quiz", question: "독립협회가 종로 광장에서 열어 민중들과 함께 국정 개혁을 요구한 집회는?", options: ["만민공동회", "3·1 운동", "6월 민주 항쟁", "안시성 항쟁"], answerIdx: 0, relicName: "만민공동회 기록", relicDesc: "만민공동회", eduTip: "백정, 상인, 학생 등 온 국민이 참여했습니다." },
                    { id: "e5_r1_q5", type: "quiz", question: "1884년 김옥균, 박영효 등 개화파가 근대 국가를 세우고자 일으킨 정변은?", options: ["갑신정변", "임오군란", "동학 농민 운동", "을미사변"], answerIdx: 0, relicName: "갑신정변 기록", relicDesc: "갑신정변", eduTip: "우정총국 개국 연회장에서 일어났습니다." },
                    { id: "e5_r1_q6", type: "quiz", question: "1894년 녹두장군 전봉준이 주도하여 보국안민과 척양척왜를 외친 운동은?", options: ["동학 농민 운동", "3·1 운동", "갑신정변", "물산장려운동"], answerIdx: 0, relicName: "전봉준 녹두장군", relicDesc: "동학 농민 운동", eduTip: "새 세상을 꿈꾼 농민들의 대규모 항쟁입니다." },
                    { id: "e5_r1_q7", type: "quiz", question: "1894년 신분제 폐지, 과부 재가 허용 등 근데 개혁을 단행한 개혁은?", options: ["갑오개혁", "광무개혁", "을미개혁", "홍경래의 난"], answerIdx: 0, relicName: "갑오개혁 문서", relicDesc: "신분제 폐지", eduTip: "노비제와 신분제가 공식적으로 폐지되었습니다." },
                    { id: "e5_r1_q8", type: "quiz", question: "1905년 일제가 대한제국의 외교권을 강제로 빼앗은 불평등 조약은?", options: ["을사늑약", "강화도 조약", "한일 신협약", "한미 수호 조약"], answerIdx: 0, relicName: "을사늑약 문서", relicDesc: "을사늑약", eduTip: "고종 황제의 승인 없이 강제로 체결되었습니다." },
                    { id: "e5_r1_q9", type: "quiz", question: "을사늑약의 무효를 알리기 위해 고종 황제가 네덜란드에 파견한 특사는?", options: ["헤이그 특사 (이준, 이상설, 이위종)", "서재필", "안중근", "김구"], answerIdx: 0, relicName: "헤이그 특사", relicDesc: "헤이그 만국평화회의", eduTip: "1907년 만국평화회의에 파견되었습니다." },
                    { id: "e5_r1_q10", type: "quiz", question: "1909년 하얼빈 역에서 이토 히로부미를 단죄한 대한의군 참모중장은?", options: ["안중근 의사", "윤봉길 의사", "유관순 열사", "김좌진 장군"], answerIdx: 0, relicName: "안중근 의사 단지록", relicDesc: "안중근 의사", eduTip: "동양 평화를 부르짖은 성웅입니다." }
                ]
            },
            {
                name: "2번 방: 근대 학교 비밀 교실",
                desc: "3·1 만세 운동과 유관순 열사의 대한독립만세!",
                hotspots: [
                    { title: "3·1 운동 태극기", icon: "fa-flag-usa", top: "35%", left: "25%", clueName: "3·1 만세 운동", clueText: "1919년 3월 1일 전 민족이 비폭력 독립 만세를 외쳤습니다.", eduTip: "3·1 운동 = 임시정부 수립 계기" },
                    { title: "유관순 열사 족자", icon: "fa-person-chalkboard", top: "55%", left: "55%", clueName: "아우내장터 유관순", clueText: "아우내 장터에서 만세 운동을 주도하고 독립을 외쳤습니다.", eduTip: "유관순 열사의 상징적 항쟁" },
                    { title: "대한민국 임시정부 현판", icon: "fa-building-columns", top: "40%", left: "80%", clueName: "대한민국 임시정부", clueText: "상하이에 수립된 민주 공화정 형태의 독립운동 거점입니다.", eduTip: "대한민국 헌법 법통 계승" }
                ],
                puzzles: [
                    { id: "e5_r2_q1", type: "quiz", question: "1919년 천안 아우내 장터에서 태극기를 나누어 주며 만세 운동을 주도한 열사는?", options: ["유관순", "안중근", "윤봉길", "김구"], answerIdx: 0, relicName: "유관순 열사 태극기", relicDesc: "유관순 열사", eduTip: "3·1 운동의 상징적 인물입니다." },
                    { id: "e5_r2_q2", type: "quiz", question: "3·1 운동의 영향을 받아 중국 상하이에 수립된 독립운동 최고 거점은?", options: ["대한민국 임시정부", "독립협회", "신민회", "화통도감"], answerIdx: 0, relicName: "대한민국 임시정부 태극기", relicDesc: "임시정부", eduTip: "김구 지청천 등을 중심으로 활약했습니다." },
                    { id: "e5_r2_q3", type: "quiz", question: "1932년 상하이 훙커우 공원에서 일제 수뇌부에 도시락 폭탄(수류탄)을 던진 의사는?", options: ["윤봉길 의사", "이봉창 의사", "안중근 의사", "유관순 열사"], answerIdx: 0, relicName: "윤봉길 의사 선서문", relicDesc: "윤봉길 의사", eduTip: "중국 국민당 장제스가 찬사를 보냈습니다." },
                    { id: "e5_r2_q4", type: "quiz", question: "1920년 봉오동 전투에서 일제 군대를 크게 무찌른 독립군 장군은?", options: ["홍범도 장군", "김좌진 장군", "이순신 장군", "강감찬 장군"], answerIdx: 0, relicName: "봉오동 전투 지도", relicDesc: "홍범도 장군", eduTip: "독립군 최초의 대규모 대승입니다." },
                    { id: "e5_r2_q5", type: "quiz", question: "1920년 청산리 계곡에서 북로군정서 등을 이끌고 일제 대군을 몰살시킨 독립군 대승은?", options: ["청산리 대첩 (김좌진)", "봉오동 전투", "살수 대첩", "진포 대첩"], answerIdx: 0, relicName: "청산리대첩 기념비", relicDesc: "김좌진 장군", eduTip: "독립운동사상 가장 빛나는 승리입니다." },
                    { id: "e5_r2_q6", type: "quiz", question: "1920년대 '내 살림 내 것으로'를 외치며 우리 물산을 쓰자고 전개한 운동은?", options: ["물산 장려 운동", "신간회 운동", "브나로드 운동", "만민공동회"], answerIdx: 0, relicName: "물산장려운동 포스터", relicDesc: "물산장려운동", eduTip: "조선 사람 조선 것 쓰기 운동입니다." },
                    { id: "e5_r2_q7", type: "quiz", question: "일제 강점기 우리말을 지키기 위해 '조선말 큰사전'을 편찬하려 한 단체는?", options: ["조선어 학회", "독립협회", "신민회", "집현전"], answerIdx: 0, relicName: "조선어학회 사전 원고", relicDesc: "조선어 학회", eduTip: "영화 '말모이'의 실제 역사입니다." },
                    { id: "e5_r2_q8", type: "quiz", question: "1926년 6·10 만세 운동과 1929년 광주 학생 항일 운동의 성격은?", options: ["학생들이 주도한 항일 독립 운동", "농민들의 세금 감면 운동", "화약 무기 개발 운동", "독립문 건립 운동"], answerIdx: 0, relicName: "학생 항일 운동 기념비", relicDesc: "학생 항일 운동", eduTip: "학생들이 독립운동의 주역이 되었습니다." },
                    { id: "e5_r2_q9", type: "quiz", question: "대한민국 임시정부의 주석으로 한국광복군을 창설하고 민족 통합에 힘쓴 위인은?", options: ["백범 김구", "이승만", "서재필", "안창호"], answerIdx: 0, relicName: "백범일지", relicDesc: "김구 선생", eduTip: "나의 소원은 첫째도 둘째도 셋째도 한국의 완전한 독립이다." },
                    { id: "e5_r2_q10", type: "quiz", question: "1940년 대한민국 임시정부가 창설한 정식 독립군 군대의 이름은?", options: ["한국광복군", "조선 의용대", "삼별초", "별기군"], answerIdx: 0, relicName: "한국광복군 서명 태극기", relicDesc: "한국광복군", eduTip: "국내 진공 작전을 준비했습니다." }
                ]
            },
            {
                name: "3번 방: 대한민국 발전 기념관",
                desc: "6·25 전쟁의 아픔을 극복하고 이룩한 한강의 기적과 민주주의!",
                hotspots: [
                    { title: "88 서울 올림픽 호돌이", icon: "fa-trophy", top: "35%", left: "30%", clueName: "1988 서울 올림픽", clueText: "전쟁의 아픔을 딛고 서울 올림픽을 성공적으로 개최했습니다.", eduTip: "한강의 기적 = 눈부신 경제 발전" },
                    { title: "6·25 전쟁 평화의 탑", icon: "fa-dove", top: "55%", left: "60%", clueName: "6·25 전쟁 평화 수호", clueText: "1950년 6·25 전쟁의 아픔을 이겨내고 평화 통일을 다짐합니다.", eduTip: "남북 평화 통일의 소망" },
                    { title: "6월 민주 항쟁 기록", icon: "fa-users-line", top: "45%", left: "80%", clueName: "대한민국 민주주의 발전", clueText: "4·19 혁명, 5·18, 6월 항쟁으로 민주주의를 확립했습니다.", eduTip: "국민이 주인 되는 대한민국" }
                ],
                puzzles: [
                    { id: "e5_r3_q1", type: "quiz", question: "1945년 8월 15일 일제 식민 지배에서 벗어나 빛을 되찾은 날을 기념하는 국경일은?", options: ["광복절", "개천절", "삼일절", "제헌절"], answerIdx: 0, relicName: "광복절 태극기", relicDesc: "8·15 광복", eduTip: "매년 8월 15일은 광복절입니다." },
                    { id: "e5_r3_q2", type: "quiz", question: "1948년 7월 17일 대한민국 최초의 헌법이 제정된 날을 기념하는 국경일은?", options: ["제헌절", "광복절", "개천절", "한글날"], answerIdx: 0, relicName: "대한민국 제헌 헌법", relicDesc: "제헌절", eduTip: "민주 공화국 헌법이 제정되었습니다." },
                    { id: "e5_r3_q3", type: "quiz", question: "1948년 8월 15일 수립된 우리나라의 공식 국호는?", options: ["대한민국", "대한제국", "조선민주주의공화국", "고려국"], answerIdx: 0, relicName: "대한민국 정부 수립", relicDesc: "대한민국", eduTip: "UN으로부터 한반도 유일의 합법 정부로 승인받았습니다." },
                    { id: "e5_r3_q4", type: "quiz", question: "1950년 6월 25일 북한의 기습 남침으로 시작되어 3년간 진행된 전쟁은?", options: ["6·25 전쟁 (한국전쟁)", "베트남 전쟁", "임진왜란", "병자호란"], answerIdx: 0, relicName: "6·25 전쟁 기록", relicDesc: "6·25 전쟁", eduTip: "1953년 7월 27일 정전 협정이 체결되었습니다." },
                    { id: "e5_r3_q5", type: "quiz", question: "1960년 부정 선거에 맞서 학생들이 주도하여 독재 정권을 퇴진시킨 혁명은?", options: ["4·19 혁명", "5·18 민주화 운동", "6월 민주 항쟁", "3·1 운동"], answerIdx: 0, relicName: "4·19 혁명 기념비", relicDesc: "4·19 혁명", eduTip: "대한민국 민주주의의 이정표입니다." },
                    { id: "e5_r3_q6", type: "quiz", question: "1980년 광주에서 계엄군에 맞서 민주주의를 요구하며 일어난 운동은?", options: ["5·18 민주화 운동", "4·19 혁명", "6월 민주 항쟁", "물산 장려 운동"], answerIdx: 0, relicName: "5·18 민주화 운동 기록", relicDesc: "5·18 민주화 운동", eduTip: "유네스코 세계기록유산에 등재되었습니다." },
                    { id: "e5_r3_q7", type: "quiz", question: "1987년 온 국민이 직선제 개헌을 요구하여 대통령 직접 선거를 이끌어낸 항쟁은?", options: ["6월 민주 항쟁", "4·19 혁명", "5·18 민주화 운동", "갑신정변"], answerIdx: 0, relicName: "6·29 선언문", relicDesc: "6월 민주 항쟁", eduTip: "대통령 직선제 민주주의가 시작되었습니다." },
                    { id: "e5_r3_q8", type: "quiz", question: "대한민국이 전쟁의 폐허를 딛고 빠른 경제 성장을 이룩한 현상을 부르는 말은?", options: ["한강의 기적", "라인강의 기적", "경부고속도로", "새마을운동"], answerIdx: 0, relicName: "한강의 기적 사진", relicDesc: "경제 발전", eduTip: "세계가 놀란 대한민국의 빠른 경제 성장입니다." },
                    { id: "e5_r3_q9", type: "quiz", question: "대한민국이 1988년 성공적으로 개최하여 세계 속에 국력을 알린 국제 스포츠 대회는?", options: ["88 서울 올림픽", "2002 월드컵", "평창 동계 올림픽", "아시안 게임"], answerIdx: 0, relicName: "88 서울 올림픽 호돌이", relicDesc: "서울 올림픽", eduTip: "동서 화합의 올림픽이었습니다." },
                    { id: "e5_r3_q10", type: "quiz", question: "2000년 남북한 정상이 최초로 만나 발표한 남북 합의서의 명칭은?", options: ["6·15 남북 공동 선언", "7·4 남북 공동 성명", "남북 기본 합의서", "한반도 평화 선언"], answerIdx: 0, relicName: "6·15 남북 공동 선언문", relicDesc: "남북 화해", eduTip: "김대중 대통령과 김정일 국방위원장이 서명했습니다." }
                ]
            }
        ]
    }
};

// ==========================================================================
// FIREBASE AUTH & FIRESTORE CLOUD DATA ISOLATION
// ==========================================================================
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseOnline = false;

function initFirebaseIfAvailable() {
    try {
        if (typeof firebase !== 'undefined' && window.ENV_FIREBASE_CONFIG) {
            firebaseApp = firebase.initializeApp(window.ENV_FIREBASE_CONFIG);
            firebaseAuth = firebase.auth();
            firebaseDb = firebase.firestore();
            isFirebaseOnline = true;
            
            firebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    document.getElementById('firebase-status-badge').textContent = `클라우드 연결됨 (${user.displayName || user.email || '인증 사용자'})`;
                    document.getElementById('firebase-status-badge').className = "status-badge-online";
                    syncUserWithFirestore(user.uid);
                } else {
                    document.getElementById('firebase-status-badge').textContent = "로컬 모드 (Firebase 미로그인)";
                    document.getElementById('firebase-status-badge').className = "status-badge-offline";
                }
            });
        }
    } catch (e) {
        console.log('Firebase init skipped or not configured yet', e);
    }
}

async function syncUserWithFirestore(uid) {
    if (!firebaseDb || !uid) return;
    try {
        const userRef = firebaseDb.collection('users').doc(uid);
        const doc = await userRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            gameState.accounts[uid] = data;
            gameState.switchUserAccount(uid);
        } else {
            const newData = gameState.accounts[gameState.currentAccount] || gameState.createNewAccountData(gameState.playerName);
            await userRef.set(newData);
        }
    } catch (e) {
        console.error('Firestore sync error', e);
    }
}

async function saveToFirestoreIfOnline() {
    if (!isFirebaseOnline || !firebaseAuth || !firebaseAuth.currentUser) return;
    try {
        const uid = firebaseAuth.currentUser.uid;
        const currentData = gameState.accounts[gameState.currentAccount];
        await firebaseDb.collection('users').doc(uid).set(currentData, { merge: true });
    } catch (e) {
        console.error('Failed saving to Firestore', e);
    }
}

// ==========================================================================
// GAME STATE MANAGEMENT (ERA UNLOCK & PROGRESSION LOCK)
// ==========================================================================
const gameState = {
    currentAccount: "학생_탐험가1",
    accounts: {},
    
    playerName: "학생_탐험가1",
    totalScore: 0,
    energy: 0,
    currentEra: 1,
    currentRoomIdx: 0,
    eraProgress: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    unlockedEras: [1], // Default: Only Era 1 is unlocked! Eras 2-5 require Time Machine Warp!
    unlockedRelics: [],
    minigameClears: 0,
    totalEscapes: 0,
    solvedQuestionIds: [],
    wrongQuestionIds: [],
    
    timerSec: 60,
    timerInterval: null,
    isTimerPaused: false,
    foundClues: [],
    activePuzzleObj: null,
    
    init() {
        this.loadAccounts();
        this.switchUserAccount(this.currentAccount);
        initFirebaseIfAvailable();
    },
    
    loadAccounts() {
        try {
            const raw = localStorage.getItem('history_escape_accounts_v3');
            if (raw) {
                this.accounts = JSON.parse(raw);
            }
            if (!this.accounts["학생_탐험가1"]) {
                this.accounts["학생_탐험가1"] = this.createNewAccountData("학생_탐험가1");
            }
            const lastActive = localStorage.getItem('history_escape_last_active');
            if (lastActive && this.accounts[lastActive]) {
                this.currentAccount = lastActive;
            }
        } catch (e) {
            this.accounts = { "학생_탐험가1": this.createNewAccountData("학생_탐험가1") };
        }
    },
    
    createNewAccountData(name) {
        return {
            name: name,
            totalScore: 0,
            energy: 0,
            eraProgress: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            unlockedEras: [1], // Only Era 1 unlocked by default
            unlockedRelics: [],
            minigameClears: 0,
            totalEscapes: 0,
            solvedQuestionIds: [],
            wrongQuestionIds: []
        };
    },
    
    switchUserAccount(accName) {
        if (!this.accounts[accName]) {
            this.accounts[accName] = this.createNewAccountData(accName);
        }
        this.currentAccount = accName;
        const data = this.accounts[accName];
        
        this.playerName = data.name;
        this.totalScore = data.totalScore || 0;
        this.energy = data.energy || 0;
        this.eraProgress = data.eraProgress || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.unlockedEras = data.unlockedEras || [1];
        this.unlockedRelics = data.unlockedRelics || [];
        this.minigameClears = data.minigameClears || 0;
        this.totalEscapes = data.totalEscapes || 0;
        this.solvedQuestionIds = data.solvedQuestionIds || [];
        this.wrongQuestionIds = data.wrongQuestionIds || [];
        
        localStorage.setItem('history_escape_last_active', accName);
        this.saveState();
        this.updateHUD();
        this.renderEraHubCards();
    },
    
    saveState() {
        try {
            this.accounts[this.currentAccount] = {
                name: this.playerName,
                totalScore: this.totalScore,
                energy: this.energy,
                eraProgress: this.eraProgress,
                unlockedEras: this.unlockedEras,
                unlockedRelics: this.unlockedRelics,
                minigameClears: this.minigameClears,
                totalEscapes: this.totalEscapes,
                solvedQuestionIds: this.solvedQuestionIds,
                wrongQuestionIds: this.wrongQuestionIds
            };
            localStorage.setItem('history_escape_accounts_v3', JSON.stringify(this.accounts));
            saveToFirestoreIfOnline();
        } catch (e) {
            console.error('Failed saving state', e);
        }
    },
    
    updateHUD() {
        document.getElementById('player-name').textContent = this.playerName;
        document.getElementById('total-score').textContent = this.totalScore;
        document.getElementById('energy-text').textContent = `${Math.min(100, this.energy)}%`;
        document.getElementById('energy-bar').style.width = `${Math.min(100, this.energy)}%`;
        document.getElementById('wrong-count-badge').textContent = this.wrongQuestionIds.length;
        
        for (let i = 1; i <= 5; i++) {
            const progEl = document.getElementById(`era-${i}-progress-text`);
            if (progEl) {
                progEl.textContent = `${this.eraProgress[i] || 0} / 3`;
            }
        }
        
        const warpBtn = document.getElementById('warp-active-btn');
        if (this.energy >= 100) {
            warpBtn.disabled = false;
            warpBtn.classList.add('glow-warp');
        } else {
            warpBtn.disabled = true;
            warpBtn.classList.remove('glow-warp');
        }
        
        this.renderEraHubCards();
    },

    renderEraHubCards() {
        const eraCards = document.querySelectorAll('.era-card');
        eraCards.forEach(card => {
            const eraId = parseInt(card.getAttribute('data-era'));
            const enterBtn = card.querySelector('.btn-enter-village');
            const isUnlocked = this.unlockedEras.includes(eraId);
            
            if (isUnlocked) {
                card.classList.remove('locked-era');
                enterBtn.disabled = false;
                enterBtn.innerHTML = `<i class="fa-solid fa-door-open"></i> 마을 진입하기`;
            } else {
                card.classList.add('locked-era');
                enterBtn.disabled = true;
                enterBtn.innerHTML = `<i class="fa-solid fa-lock"></i> 🔒 타임머신 에너지 100% 모아 해금`;
            }
        });
    }
};

// ==========================================================================
// CONTROLLER & UI EVENTS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    gameState.init();
    setupEventListeners();
    renderHallOfFameTables();
    renderRelicGallery();
});

function setupEventListeners() {
    document.getElementById('switch-account-btn').addEventListener('click', () => {
        renderAccountListModal();
        openModal('modal-login-account');
    });
    document.getElementById('close-login-modal').addEventListener('click', () => closeModal('modal-login-account'));
    
    document.getElementById('btn-login-submit').addEventListener('click', () => {
        const inp = document.getElementById('student-name-input');
        const val = inp.value.trim();
        if (val.length > 0) {
            gameState.switchUserAccount(val);
            inp.value = '';
            closeModal('modal-login-account');
            alert(`🎉 '${val}' 학생 계정으로 로그인되었습니다!`);
        }
    });

    document.getElementById('btn-google-login').addEventListener('click', () => {
        if (!firebaseAuth) {
            alert('⚙️ Firebase 설정이 아직 완료되지 않았습니다.\nVercel 환경변수 등록 또는 Firebase 개발자 콘솔에서 키를 설정해주세요.');
            return;
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        firebaseAuth.signInWithPopup(provider).then(result => {
            alert(`🔑 Firebase 구글 인증 성공: ${result.user.displayName}님 환영합니다!`);
            closeModal('modal-login-account');
        }).catch(err => {
            alert(`Firebase 인증 안내: ${err.message}`);
        });
    });

    document.getElementById('wrong-notes-btn').addEventListener('click', () => {
        renderWrongNotesModal();
        openModal('modal-wrong-notes');
    });
    document.getElementById('close-wrong-modal').addEventListener('click', () => closeModal('modal-wrong-notes'));

    document.getElementById('hall-of-fame-btn').addEventListener('click', () => {
        renderHallOfFameTables();
        openModal('modal-hall-of-fame');
    });
    document.getElementById('relic-gallery-btn').addEventListener('click', () => {
        renderRelicGallery();
        openModal('modal-relic-gallery');
    });
    document.getElementById('close-hall-modal').addEventListener('click', () => closeModal('modal-hall-of-fame'));
    document.getElementById('close-relic-modal').addEventListener('click', () => closeModal('modal-relic-gallery'));

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const targetId = e.currentTarget.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    document.querySelectorAll('.btn-enter-village').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eraId = parseInt(e.currentTarget.getAttribute('data-era'));
            if (gameState.unlockedEras.includes(eraId)) {
                openVillageScreen(eraId);
            } else {
                alert('🔒 아직 해금되지 않은 시대입니다! 타임머신 에너지를 100% 모아 이동하세요.');
            }
        });
    });

    document.getElementById('back-to-hub-btn').addEventListener('click', () => switchScreen('screen-era-hub'));

    document.getElementById('exit-room-btn').addEventListener('click', () => {
        if (confirm('방탈출을 중단하고 마을로 돌아가시겠습니까?')) {
            clearInterval(gameState.timerInterval);
            switchScreen('screen-village-map');
        }
    });

    document.getElementById('close-clue-modal').addEventListener('click', closeClueModal);
    document.getElementById('modal-clue-confirm-btn').addEventListener('click', closeClueModal);

    document.getElementById('warp-active-btn').addEventListener('click', triggerTimeMachineWarp);
    
    // FINISH WARP & UNLOCK NEXT ERA!
    document.getElementById('btn-finish-warp').addEventListener('click', () => {
        closeModal('modal-warp');
        
        // Find next era to unlock
        let nextEraToUnlock = 1;
        for (let i = 1; i <= 5; i++) {
            if (!gameState.unlockedEras.includes(i)) {
                nextEraToUnlock = i;
                break;
            }
        }
        if (!gameState.unlockedEras.includes(nextEraToUnlock)) {
            gameState.unlockedEras.push(nextEraToUnlock);
        }
        
        gameState.energy = 0;
        gameState.saveState();
        gameState.updateHUD();
        
        // Automatically enter the newly unlocked era village!
        openVillageScreen(nextEraToUnlock);
    });

    document.getElementById('btn-next-room').addEventListener('click', () => {
        closeModal('modal-success');
        if (gameState.currentRoomIdx < 2) {
            startEscapeRoom(gameState.currentEra, gameState.currentRoomIdx + 1);
        } else {
            switchScreen('screen-village-map');
            openVillageScreen(gameState.currentEra);
        }
    });
}

function switchScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// ==========================================================================
// VILLAGE SCREEN
// ==========================================================================
function openVillageScreen(eraId) {
    gameState.currentEra = eraId;
    const eraData = HISTORY_GAME_DATA[eraId];
    
    document.getElementById('village-title').textContent = `${eraData.eraName} 마을 탐험`;
    document.getElementById('village-bg-img').src = eraData.bgImg;

    const clearedCount = gameState.eraProgress[eraId] || 0;
    const roomNodes = document.querySelectorAll('.room-node-card');
    
    roomNodes.forEach((node, idx) => {
        const roomInfo = eraData.rooms[idx];
        node.querySelector('.room-name').textContent = roomInfo.name.split(':')[1] || roomInfo.name;
        node.querySelector('.room-desc').textContent = roomInfo.desc;
        
        const pill = node.querySelector('.status-pill');
        const startBtn = node.querySelector('.btn-start-room');
        
        if (idx < clearedCount) {
            pill.textContent = "클리어!";
            pill.className = "status-pill status-cleared";
            startBtn.disabled = false;
            startBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> 다시 도전`;
        } else if (idx === clearedCount) {
            pill.textContent = "탈출 가능";
            pill.className = "status-pill status-unlocked";
            startBtn.disabled = false;
            startBtn.innerHTML = `<i class="fa-solid fa-key"></i> 방 진입 (1분 도전)`;
        } else {
            pill.textContent = "잠김";
            pill.className = "status-pill status-locked";
            startBtn.disabled = true;
            startBtn.innerHTML = `<i class="fa-solid fa-lock"></i> 이전 방 클리어 필요`;
        }
        
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        newBtn.addEventListener('click', () => startEscapeRoom(eraId, idx));
    });

    switchScreen('screen-village-map');
}

// ==========================================================================
// ESCAPE ROOM SESSION & QUESTION SELECTION
// ==========================================================================
function startEscapeRoom(eraId, roomIdx) {
    gameState.currentEra = eraId;
    gameState.currentRoomIdx = roomIdx;
    
    const eraData = HISTORY_GAME_DATA[eraId];
    const roomData = eraData.rooms[roomIdx];
    
    document.getElementById('current-room-title').textContent = roomData.name;
    document.getElementById('current-room-era-tag').textContent = eraData.eraName;
    document.getElementById('room-bg').src = eraData.bgImg;
    
    const availablePool = roomData.puzzles;
    let selectedPuzzle = availablePool.find(p => !gameState.solvedQuestionIds.includes(p.id));
    
    if (!selectedPuzzle) {
        selectedPuzzle = availablePool[Math.floor(Math.random() * availablePool.length)];
    }
    
    gameState.activePuzzleObj = selectedPuzzle;
    gameState.timerSec = 60;
    gameState.isTimerPaused = false;
    gameState.foundClues = [];
    
    updateTimerDisplay();
    updateClueInventoryUI();
    renderHotspots(roomData);
    renderPuzzleArea(selectedPuzzle);
    
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isTimerPaused) {
            gameState.timerSec--;
            audioSFX.play('tick');
            updateTimerDisplay();
            
            if (gameState.timerSec <= 0) {
                clearInterval(gameState.timerInterval);
                audioSFX.play('wrong');
                if (!gameState.wrongQuestionIds.includes(selectedPuzzle.id)) {
                    gameState.wrongQuestionIds.push(selectedPuzzle.id);
                    gameState.saveState();
                    gameState.updateHUD();
                }
                alert('⏰ 1분 시간이 지나 방탈출에 실패했습니다! 틀린 문제는 오답 노트에서 다시 복습해보세요.');
                switchScreen('screen-village-map');
            }
        }
    }, 1000);

    switchScreen('screen-escape-room');
}

function updateTimerDisplay() {
    const secEl = document.getElementById('timer-sec');
    const barEl = document.getElementById('timer-progress');
    const widgetEl = document.getElementById('timer-widget');
    const pauseBadge = document.getElementById('timer-pause-badge');
    
    secEl.textContent = gameState.timerSec;
    const offset = 276 * (1 - gameState.timerSec / 60);
    barEl.style.strokeDashoffset = offset;
    
    if (gameState.timerSec <= 15) {
        widgetEl.classList.add('warning');
    } else {
        widgetEl.classList.remove('warning');
    }

    if (gameState.isTimerPaused) {
        pauseBadge.classList.remove('hidden');
    } else {
        pauseBadge.classList.add('hidden');
    }
}

function renderHotspots(roomData) {
    const container = document.getElementById('hotspots-container');
    container.innerHTML = '';
    
    roomData.hotspots.forEach((hs, idx) => {
        const btn = document.createElement('button');
        btn.className = 'hotspot-btn';
        btn.style.top = hs.top;
        btn.style.left = hs.left;
        btn.setAttribute('data-clue-idx', idx);
        
        btn.innerHTML = `
            <span class="hotspot-ping"></span>
            <i class="fa-solid ${hs.icon}"></i>
            <span class="hotspot-label">${hs.title}</span>
        `;
        btn.addEventListener('click', () => inspectClue(hs, idx));
        container.appendChild(btn);
    });
}

function inspectClue(clueData, idx) {
    audioSFX.play('clue');
    gameState.isTimerPaused = true;
    updateTimerDisplay();
    
    if (!gameState.foundClues.includes(idx)) {
        gameState.foundClues.push(idx);
        updateClueInventoryUI();
    }
    
    document.getElementById('modal-clue-item-name').textContent = clueData.clueName;
    document.getElementById('modal-clue-text').textContent = clueData.clueText;
    document.getElementById('modal-educational-fact').textContent = `초등 5학년 역사 포인트: ${clueData.eduTip}`;
    document.getElementById('modal-clue-icon').innerHTML = `<i class="fa-solid ${clueData.icon}"></i>`;
    
    openModal('modal-clue');
}

function closeClueModal() {
    closeModal('modal-clue');
    gameState.isTimerPaused = false;
    updateTimerDisplay();
}

function updateClueInventoryUI() {
    const roomData = HISTORY_GAME_DATA[gameState.currentEra].rooms[gameState.currentRoomIdx];
    const box = document.getElementById('clue-list-box');
    const countText = document.getElementById('clue-count-text');
    
    countText.textContent = `${gameState.foundClues.length} / ${roomData.hotspots.length}`;
    
    if (gameState.foundClues.length === 0) {
        box.innerHTML = `
            <div class="clue-empty-notice">
                <i class="fa-solid fa-lightbulb"></i>
                <p>방 안의 반짝이는 물건을 눌러 단서를 찾아보세요!</p>
            </div>
        `;
        return;
    }
    
    box.innerHTML = '';
    gameState.foundClues.forEach(idx => {
        const hs = roomData.hotspots[idx];
        const item = document.createElement('div');
        item.className = 'clue-item-card';
        item.innerHTML = `
            <i class="fa-solid ${hs.icon}"></i>
            <span>${hs.clueName}</span>
        `;
        item.addEventListener('click', () => inspectClue(hs, idx));
        box.appendChild(item);
    });
}

function renderPuzzleArea(puzzle) {
    const area = document.getElementById('puzzle-interaction-area');
    const prompt = document.getElementById('lock-question-text');
    area.innerHTML = '';
    
    prompt.textContent = `🔒 ${puzzle.question}`;
    
    if (puzzle.type === 'quiz') {
        puzzle.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = `${idx + 1}. ${optText}`;
            btn.addEventListener('click', () => attemptSolve(idx === puzzle.answerIdx));
            area.appendChild(btn);
        });
    } else if (puzzle.type === 'digit') {
        area.innerHTML = `
            <div class="digit-lock-container">
                <div class="digit-inputs">
                    <input type="text" id="digit-input-field" class="digit-box" placeholder="답 입력">
                </div>
                <button id="btn-digit-submit" class="btn-submit-lock"><i class="fa-solid fa-key"></i> 자물쇠 해제</button>
            </div>
        `;
        document.getElementById('btn-digit-submit').addEventListener('click', () => {
            const val = document.getElementById('digit-input-field').value.trim();
            attemptSolve(val === puzzle.answer);
        });
    }
}

function attemptSolve(isCorrect) {
    const puzzle = gameState.activePuzzleObj;
    
    if (isCorrect) {
        clearInterval(gameState.timerInterval);
        audioSFX.play('correct');
        
        if (!gameState.solvedQuestionIds.includes(puzzle.id)) {
            gameState.solvedQuestionIds.push(puzzle.id);
        }
        gameState.wrongQuestionIds = gameState.wrongQuestionIds.filter(id => id !== puzzle.id);
        
        handleRoomSuccess();
    } else {
        audioSFX.play('wrong');
        if (!gameState.wrongQuestionIds.includes(puzzle.id)) {
            gameState.wrongQuestionIds.push(puzzle.id);
            gameState.saveState();
            gameState.updateHUD();
        }
        alert('❌ 비밀 암호가 틀렸습니다! 수집한 단서를 다시 확인하거나 오답 노트에서 복습해보세요.');
    }
}

function handleRoomSuccess() {
    const eraId = gameState.currentEra;
    const roomIdx = gameState.currentRoomIdx;
    const puzzle = gameState.activePuzzleObj;
    
    const speedBonus = gameState.timerSec * 10;
    const scoreGained = 300 + speedBonus;
    const energyGained = 34; // 3 rooms x 34% = 100% Energy per era!
    
    gameState.totalScore += scoreGained;
    gameState.energy = Math.min(100, gameState.energy + energyGained);
    gameState.minigameClears += 1;
    gameState.totalEscapes += 1;
    
    if (gameState.eraProgress[eraId] <= roomIdx) {
        gameState.eraProgress[eraId] = roomIdx + 1;
    }
    
    if (puzzle.relicName && !gameState.unlockedRelics.includes(puzzle.relicName)) {
        gameState.unlockedRelics.push(puzzle.relicName);
    }
    
    gameState.saveState();
    gameState.updateHUD();
    
    document.getElementById('success-room-name').textContent = `${HISTORY_GAME_DATA[eraId].rooms[roomIdx].name} 탈출 성공!`;
    document.getElementById('rw-time-left').textContent = `${gameState.timerSec}초 남음`;
    document.getElementById('rw-score-gained').textContent = `+${scoreGained}점`;
    document.getElementById('rw-energy-gained').textContent = `+${energyGained}% 충전`;
    
    const relicBox = document.getElementById('unlocked-relic-card-box');
    relicBox.innerHTML = `
        <i class="fa-solid fa-award text-gold"></i>
        <span>새로운 역사 도감 해금: <strong>${puzzle.relicName}</strong> (${puzzle.relicDesc})</span>
    `;
    
    openModal('modal-success');
}

function triggerTimeMachineWarp() {
    audioSFX.play('warp');
    
    let nextEraName = "다음 시대";
    for (let i = 1; i <= 5; i++) {
        if (!gameState.unlockedEras.includes(i)) {
            nextEraName = HISTORY_GAME_DATA[i].eraName;
            break;
        }
    }
    
    document.getElementById('warp-era-name').textContent = `${nextEraName} 시대로 워프...`;
    openModal('modal-warp');
}

// ==========================================================================
// WRONG NOTES & ACCOUNT RENDERERS
// ==========================================================================
function renderWrongNotesModal() {
    const container = document.getElementById('wrong-notes-list');
    container.innerHTML = '';
    
    if (gameState.wrongQuestionIds.length === 0) {
        container.innerHTML = `
            <div class="clue-empty-notice" style="padding:40px;">
                <i class="fa-solid fa-circle-check text-green" style="font-size:3rem;"></i>
                <p style="margin-top:10px;">틀린 역사 문제가 없습니다! 아주 훌륭합니다.</p>
            </div>
        `;
        return;
    }
    
    const wrongPuzzles = [];
    Object.keys(HISTORY_GAME_DATA).forEach(eraId => {
        HISTORY_GAME_DATA[eraId].rooms.forEach(room => {
            room.puzzles.forEach(p => {
                if (gameState.wrongQuestionIds.includes(p.id)) {
                    wrongPuzzles.push({ ...p, eraName: HISTORY_GAME_DATA[eraId].eraName, roomName: room.name });
                }
            });
        });
    });

    wrongPuzzles.forEach(p => {
        const card = document.createElement('div');
        card.className = 'wrong-note-card';
        
        let correctAnsText = '';
        if (p.type === 'quiz') {
            correctAnsText = p.options[p.answerIdx];
        } else {
            correctAnsText = p.answer;
        }

        card.innerHTML = `
            <div class="wrong-note-header">
                <span>[${p.eraName}] ${p.roomName}</span>
                <span>오답 복습</span>
            </div>
            <div class="wrong-note-q">Q. ${p.question}</div>
            <div class="wrong-note-ans">💡 정답: <strong>${correctAnsText}</strong></div>
            <div class="wrong-note-tip">🎓 해설: ${p.eduTip}</div>
        `;
        container.appendChild(card);
    });
}

function renderAccountListModal() {
    const grid = document.getElementById('account-cards-grid');
    grid.innerHTML = '';
    
    Object.keys(gameState.accounts).forEach(accKey => {
        const acc = gameState.accounts[accKey];
        const card = document.createElement('div');
        card.className = `account-card ${accKey === gameState.currentAccount ? 'active-account' : ''}`;
        
        card.innerHTML = `
            <div class="account-name"><i class="fa-solid fa-user"></i> ${acc.name}</div>
            <div class="account-info">점수: ${acc.totalScore}점</div>
            <div class="account-info">해금한 시대: ${(acc.unlockedEras || [1]).length}개</div>
            <div class="account-info text-rose">오답: ${(acc.wrongQuestionIds || []).length}개</div>
        `;
        
        card.addEventListener('click', () => {
            gameState.switchUserAccount(accKey);
            closeModal('modal-login-account');
            alert(`👤 '${acc.name}' 학생 계정으로 전환되었습니다.`);
        });
        grid.appendChild(card);
    });
}

// ==========================================================================
// HALL OF FAME & RELIC GALLERY
// ==========================================================================
function renderHallOfFameTables() {
    const eraBody = document.getElementById('rank-table-era-body');
    const allAccountsList = Object.values(gameState.accounts);
    
    const defaultMocks = [
        { name: "역사박사 세종", totalScore: 9800, eraProgress: {1:3,2:3,3:3,4:3,5:3}, totalEscapes: 15 },
        { name: "화랑 김유신", totalScore: 8400, eraProgress: {1:3,2:3,3:3,4:3,5:0}, totalEscapes: 12 },
        { name: "탐험가 지혜", totalScore: 7900, eraProgress: {1:3,2:3,3:3,4:2,5:0}, totalEscapes: 11 }
    ];
    
    const combined = [...allAccountsList, ...defaultMocks];
    combined.sort((a,b) => b.totalScore - a.totalScore);
    
    eraBody.innerHTML = combined.slice(0, 10).map((r, i) => {
        const erasCount = Object.values(r.eraProgress || {}).filter(v => v >= 3).length;
        return `
            <tr>
                <td class="${i === 0 ? 'rank-top1' : i === 1 ? 'rank-top2' : i === 2 ? 'rank-top3' : ''}">${i + 1}위</td>
                <td><strong>${r.name}</strong></td>
                <td>${erasCount}개 시대</td>
                <td>${r.totalEscapes || 0}회</td>
                <td class="text-gold">${(r.totalScore || 0).toLocaleString()}점</td>
            </tr>
        `;
    }).join('');

    const miniBody = document.getElementById('rank-table-mini-body');
    const miniCombined = [...allAccountsList, ...defaultMocks];
    miniCombined.sort((a,b) => (b.minigameClears || b.totalEscapes || 0) - (a.minigameClears || a.totalEscapes || 0));
    
    miniBody.innerHTML = miniCombined.slice(0, 10).map((r, i) => `
        <tr>
            <td class="${i === 0 ? 'rank-top1' : i === 1 ? 'rank-top2' : i === 2 ? 'rank-top3' : ''}">${i + 1}위</td>
            <td><strong>${r.name}</strong></td>
            <td class="text-cyan">${r.minigameClears || r.totalEscapes || 0}회 클리어</td>
            <td>40초</td>
            <td class="text-gold">${(r.totalScore || 0).toLocaleString()}점</td>
        </tr>
    `).join('');
}

function renderRelicGallery() {
    const grid = document.getElementById('relic-grid');
    grid.innerHTML = '';
    
    let allRelics = [];
    Object.keys(HISTORY_GAME_DATA).forEach(eraId => {
        HISTORY_GAME_DATA[eraId].rooms.forEach(r => {
            r.puzzles.forEach(p => {
                if (p.relicName && !allRelics.some(item => item.name === p.relicName)) {
                    allRelics.push({
                        name: p.relicName,
                        desc: p.relicDesc,
                        era: HISTORY_GAME_DATA[eraId].eraName
                    });
                }
            });
        });
    });

    allRelics.forEach(rel => {
        const isUnlocked = gameState.unlockedRelics.includes(rel.name);
        const card = document.createElement('div');
        card.className = `relic-card ${isUnlocked ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="relic-card-icon">
                <i class="fa-solid ${isUnlocked ? 'fa-award' : 'fa-lock'}"></i>
            </div>
            <h5>${rel.name}</h5>
            <p>${isUnlocked ? rel.desc : '방탈출 클리어 시 해금'}</p>
            <span class="era-tag" style="font-size:0.68rem; margin-top:4px;">${rel.era}</span>
        `;
        grid.appendChild(card);
    });
}
