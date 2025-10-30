import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVK8jCzkA6bC2kphntL4-t4R9rogQPeXM",
  authDomain: "iot2022clase.firebaseapp.com",
  databaseURL: "https://iot2022clase-default-rtdb.firebaseio.com",
  projectId: "iot2022clase",
  storageBucket: "iot2022clase.appspot.com",
  messagingSenderId: "791551664339",
  appId: "1:791551664339:web:99db64b35b0becbf55b426"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias
const tempRef = ref(db, "Temperatura");
const humRef = ref(db, "Humedad");
const lightRef = ref(db, "Luz");
const ledRef = ref(db, "ledValue");

// Variables globales
let ledState = "0";

// DOM elements
const tempEl = document.getElementById("temp");
const humEl = document.getElementById("hum");
const lightEl = document.getElementById("light");
const ledBtn = document.getElementById("led-btn");

// Control LED
onValue(ledRef, (snapshot) => {
  ledState = snapshot.val();
  ledBtn.textContent = ledState === "1" ? "Apagar LED" : "Encender LED";
  console.log("Datos recibidos:", ledState);
  
});

ledBtn.addEventListener("click", () => {
  const newState = ledState === "1" ? "0" : "1";
  set(ledRef, newState);
});

// Configuración de gráficos
const maxPoints = 20;
const timeLabels = [];

const tempData = [];
const humData = [];
const lightData = [];

const createChart = (ctx, label, color, data) => new Chart(ctx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [{
      label,
      data,
      borderColor: color,
      borderWidth: 2,
      tension: 0.2,
      pointRadius: 0
    }]
  },
  options: {
    animation: false,
    scales: {
      y: { beginAtZero: true },
      x: { display: false }
    },
    plugins: { legend: { labels: { color: "#fff" } } }
  }
});

// Inicializa gráficos
const tempChart = createChart(document.getElementById("tempChart"), "Temperatura (°C)", "#ff6384", tempData);
const humChart = createChart(document.getElementById("humChart"), "Humedad (%)", "#36a2eb", humData);
const lightChart = createChart(document.getElementById("lightChart"), "Luz", "#ffcd56", lightData);

// Actualiza datos y gráficas
const updateChart = (chart, value, dataArray) => {
  const now = new Date().toLocaleTimeString().split(" ")[0];
  if (timeLabels.length >= maxPoints) {
    timeLabels.shift();
    dataArray.shift();
  }
  timeLabels.push(now);
  dataArray.push(value);
  chart.update();
};

// Lectura en tiempo real
onValue(tempRef, (snapshot) => {
  const val = snapshot.val();
  tempEl.innerText = val;
  updateChart(tempChart, val, tempData);
});

onValue(humRef, (snapshot) => {
  const val = snapshot.val();
  humEl.innerText = val;
  updateChart(humChart, val, humData);
});

onValue(lightRef, (snapshot) => {
  const val = snapshot.val();
  lightEl.innerText = val;
  updateChart(lightChart, val, lightData);
});
