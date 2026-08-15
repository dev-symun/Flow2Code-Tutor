
// ==========================
// 상태 관리
// ==========================

const state = {
    started: false,
    step: 0,

    problem: "",

    input: "",
    output: "",
    process: "",
    condition: ""
};

// ==========================
// Mermaid 렌더링
// ==========================

async function renderMermaid() {

    if (!window.mermaid) {
        return;
    }

    const diagram = document.getElementById("diagram");

    let graph = getMermaidCode();

    try {

        const renderId = "flowchart_" + Date.now();

        const result = await mermaid.render(
            renderId,
            graph
        );

        diagram.innerHTML = result.svg;

    } catch (error) {

        console.error(error);

        diagram.innerHTML =
            "<p style='color:red'>순서도 생성 오류</p>";
    }
}

// ==========================
// 순서도 생성
// ==========================

function getMermaidCode() {

    let code = `
flowchart TD

A([시작])
`;

    // 입력

    if (state.input) {

        code += `
B[/${state.input}/]

A --> B
`;
    }

    // 처리

    if (state.process) {

        code += `
C[${state.process}]
`;

        if (state.input) {
            code += `B --> C\n`;
        }
    }

    // 조건

    if (state.condition) {

        code += `
D{${state.condition}}
`;

        if (state.process) {
            code += `C --> D\n`;
        }
    }

    // 출력

    if (state.output) {

        if (state.condition) {

            code += `
E[/${state.output}/]

D --> E
`;

        } else {

            code += `
E[/${state.output}/]
`;

            if (state.process) {
                code += `C --> E\n`;
            }
            else if (state.input) {
                code += `B --> E\n`;
            }
        }
    }

    // 종료

    code += `
Z([종료])
`;

    if (state.output) {

        code += `
E --> Z
`;
    }

    return code;
}

// ==========================
// 질문 전환
// ==========================

function updateQuestion() {

    const chat = document.getElementById("chatMessage");

    switch (state.step) {

        case 1:

            chat.innerHTML = `
<h3>🤖 Flow2Code Tutor</h3>

<p>좋아요! 😊</p>

<p>
첫 번째 질문이에요.
</p>

<p>
이 문제에서 사용자가 입력해야 하는 값은 무엇일까요?
</p>
`;

            break;

        case 2:

            chat.innerHTML = `
<h3>🤖 Flow2Code Tutor</h3>

<p>좋은 시작이에요! 🎉</p>

<p>
그럼 결과로 무엇을 출력해야 할까요?
</p>
`;

            break;

        case 3:

            chat.innerHTML = `
<h3>🤖 Flow2Code Tutor</h3>

<p>좋아요! 😊</p>

<p>
입력한 값을 바로 출력하면 될까요?
</p>

<p>
중간에 어떤 처리 과정이 필요할까요?
</p>
`;

            break;

        case 4:

            chat.innerHTML = `
<h3>🤖 Flow2Code Tutor</h3>

<p>좋은 생각이에요! 🚀</p>

<p>
판단하거나 비교해야 하는 조건이 있을까요?
</p>
`;

            break;

        case 5:

            chat.innerHTML = `
<h3>🤖 Flow2Code Tutor</h3>

<p>🎉 순서도가 완성되었어요!</p>

<p>
정말 잘했어요.
</p>

<p>
입력 → 처리 → 조건 → 출력 구조를 찾았네요.
</p>

<p>
다음 단계에서는 각 도형을 Python 코드로 바꾸게 될 거예요.
</p>
`;

            break;
    }
}

// ==========================
// 입력 처리
// ==========================

function handleSubmit() {

    const inputBox =
        document.getElementById("userInput");

    const text =
        inputBox.value.trim();

    if (!text) return;

    inputBox.value = "";

    // 문제 입력

    if (!state.started) {

        state.started = true;

        state.problem = text;

        state.step = 1;

        document.getElementById(
            "problemText"
        ).innerText = text;

        updateQuestion();

        renderMermaid();

        return;
    }

    // 입력

    if (state.step === 1) {

        state.input = text;

        state.step = 2;

        renderMermaid();

        updateQuestion();

        return;
    }

    // 출력

    if (state.step === 2) {

        state.output = text;

        state.step = 3;

        renderMermaid();

        updateQuestion();

        return;
    }

    // 처리

    if (state.step === 3) {

        state.process = text;

        state.step = 4;

        renderMermaid();

        updateQuestion();

        return;
    }

    // 조건

    if (state.step === 4) {

        state.condition = text;

        state.step = 5;

        renderMermaid();

        updateQuestion();

        return;
    }
}

// ==========================
// 버튼 이벤트
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const btn =
        document.getElementById("submitBtn");

    btn.addEventListener(
        "click",
        handleSubmit
    );

    renderMermaid();
});
