// ---------------------- Firebase ----------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAScg0_xqcwpqkehstGjyvcV33bl5nSlvw",
  authDomain: "test-app-dfea8.firebaseapp.com",
  projectId: "test-app-dfea8",
  storageBucket: "test-app-dfea8.appspot.com",
  messagingSenderId: "1093185318469",
  appId: "1:1093185318469:web:f8befe69e0fbc701073d2c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------------- Вопросы ----------------------
const questions = [
{q:"1. Представьте, что вам предстоит выступление перед аудиторией.", a:["Хочу избежать выступления","Немного волнуюсь, справлюсь","С нетерпением жду"], scores:[1,2,3], category:"energy"},
{q:"2. Как вы готовитесь к важному экзамену?", a:["Только самостоятельно","Смешанно","Только с друзьями"], scores:[1,2,3], category:"social"},
{q:"3. Идеальный вечер пятницы?", a:["Тихо дома","Иногда тусовка, иногда дома","Громкая вечеринка"], scores:[1,2,3], category:"energy"},
{q:"4. Что выберете в компании?", a:["Сидеть в сторонке","Участвовать при интересе","Быть в центре внимания"], scores:[1,2,3], category:"social"},
{q:"5. Что нужно после напряжённого дня?", a:["Побыть одному","Иногда с друзьями, иногда один","Пойти общаться"], scores:[1,2,3], category:"energy"},
{q:"6. После долгого общения?", a:["Усталость, хочу один","Зависит от ситуации","Заряд энергии"], scores:[1,2,3], category:"energy"},
{q:"7. Легко ли завязать разговор с незнакомцем?", a:["Нет","Иногда","Да"], scores:[1,2,3], category:"social"},
{q:"8. Легко ли заводите новых друзей?", a:["Сложно","Иногда быстро","Очень легко"], scores:[1,2,3], category:"social"},
{q:"9. Часто нужна потребность в одиночестве?", a:["Каждый день","Периодически","Редко"], scores:[3,2,1], category:"energy"},
{q:"10. Часто ли окружающие неправильно считывают ваши эмоции?", a:["Постоянно","Иногда","Редко"], scores:[3,2,1], category:"decision"},
{q:"11. Как принимаете решения?", a:["Долго размышляю один","Советуюсь, потом решаю","Обсуждаю вслух"], scores:[3,2,1], category:"decision"},
{q:"12. Планируете заранее или действуете по ситуации?", a:["Всегда планирую","Зависит от ситуации","Импровизирую"], scores:[3,2,1], category:"decision"},
{q:"13. Работа: высок.зарплата или комфортный коллектив?", a:["Только зарплата","Смешано","Комфорт важнее"], scores:[1,2,3], category:"social"}
];

// ---------------------- Переменные ----------------------
let currentQuestion = 0;
let socialScore=0, energyScore=0, decisionScore=0;
let age="", direction="", type="";

// ---------------------- DOM ----------------------
const startBtn=document.getElementById("start-btn");
const startScreen=document.getElementById("start-screen");
const quiz=document.getElementById("quiz");
const questionText=document.getElementById("question-text");
const answersDiv=document.getElementById("answers");
const nextBtn=document.getElementById("next-btn");
const resultScreen=document.getElementById("result-screen");
const resultText=document.getElementById("result-text");

// ---------------------- Старт ----------------------
startBtn.addEventListener("click",()=>{
  age=document.getElementById("age").value;
  direction=document.getElementById("direction").value;
  if(!age||!direction){alert("Заполните все поля!");return;}
  startScreen.classList.add("hidden");
  quiz.classList.remove("hidden");
  showQuestion();
});

// ---------------------- Показ вопроса ----------------------
function showQuestion(){
  const q=questions[currentQuestion];
  questionText.textContent=q.q;
  answersDiv.innerHTML="";
  q.a.forEach((answer,i)=>{
    const label=document.createElement("label");
    label.innerHTML=`<input type="radio" name="answer" value="${q.scores[i]}"> ${answer}`;
    answersDiv.appendChild(label);
  });
}

// ---------------------- Далее ----------------------
nextBtn.addEventListener("click",()=>{
  const selected=document.querySelector('input[name="answer"]:checked');
  if(!selected){alert("Выберите вариант!");return;}
  const score=Number(selected.value);
  const cat=questions[currentQuestion].category;
  if(cat==="social") socialScore+=score;
  if(cat==="energy") energyScore+=score;
  if(cat==="decision") decisionScore+=score;
  currentQuestion++;
  if(currentQuestion<questions.length) showQuestion();
  else showResult();
});

// ---------------------- Результат и сохранение ----------------------
async function saveResult() {
  try {
    await addDoc(collection(db, "quizResults"), {
      age: parseInt(age),
      direction: direction,
      socialScore: socialScore,
      energyScore: energyScore,
      decisionScore: decisionScore,
      type: type,
      date: new Date().toISOString()
    });
    console.log("Результат успешно сохранён!");
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    alert("Ошибка при сохранении результатов. Попробуйте позже.");
  }
}

function showResult(){
  quiz.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const socialPercent=Math.round(socialScore/(questions.filter(q=>q.category==="social").length*3)*100);
  const energyPercent=Math.round(energyScore/(questions.filter(q=>q.category==="energy").length*3)*100);

  if(energyPercent>=65 && socialPercent>=65) type="Экстраверт";
  else if(energyPercent>=50 && socialPercent>=50) type="Амбиверт со склонностью к экстраверту";
  else if(energyPercent<50 && socialPercent>=50) type="Амбиверт со склонностью к интроверту";
  else type="Интроверт";

  const desc = {
    "Экстраверт":"Экстраверт – направляет энергию во вне, комфортно среди людей.",
    "Амбиверт со склонностью к экстраверту":"Амбиверт с выраженной социальной активностью, но иногда нуждается в одиночестве.",
    "Амбиверт со склонностью к интроверту":"Амбиверт с преимущественным внутренним фокусом, иногда общителен.",
    "Интроверт":"Интроверт – предпочитает одиночество или близкий круг."
  }[type];

  resultText.textContent = `Возраст: ${age}, Направление: ${direction}, Тип личности: ${type}\nОписание: ${desc}\nСоциальность: ${socialPercent}%, Энергия: ${energyPercent}%`;

  saveResult();
}
