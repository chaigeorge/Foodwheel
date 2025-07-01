let theWheel;

const resultCard = document.getElementById("result-card");
const resultText = document.getElementById("result");

function showResult(text) {
  resultText.textContent = text;
  resultCard.classList.remove("hidden");
  // Fade in effect
  resultCard.style.opacity = 0;
  setTimeout(() => {
    resultCard.style.opacity = 1;
  }, 10);
  // Confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

document.getElementById("load-btn").addEventListener("click", () => {
  const cafeteria = document.getElementById("cafeteria-select").value;
  if (!cafeteria) {
    alert("Please choose a cafeteria");
    return;
  }

  Papa.parse(`data/${cafeteria}.csv`, {
    download: true,
    header: true,
    complete: function(results) {
      const foodList = results.data.map(row => row.food).filter(Boolean);
      
      if (foodList.length === 0) {
        alert("No food found in the file.");
        return;
      }

      // Clear canvas if reloaded
      const canvas = document.getElementById('wheel-canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      theWheel = new Winwheel({
        canvasId: 'wheel-canvas',
        numSegments: foodList.length,
        segments: foodList.map(f => ({ text: f })),
        animation: {
          type: 'spinToStop',
          duration: 5,
          spins: 8,
          callbackFinished: (segment) => {
            showResult(`You should eat: 🍽️ ${segment.text}`);
          }
        }
      });

      document.getElementById("spin-btn").disabled = false;
      resultCard.classList.add("hidden");
    }
  });
});

document.getElementById("spin-btn").addEventListener("click", () => {
  if (theWheel) {
    theWheel.startAnimation();
  }
});
