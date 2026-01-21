//document.addEventListener("DOMContentLoaded", () => {
  // Add the fade-in class after a short delay to ensure CSS is applied
  //setTimeout(() => {
   // document.body.classList.add('fade-in');
 // }, 100); // Adjust delay as needed
  
//});

document.addEventListener("DOMContentLoaded", () => {
  // Fade-in effect
  setTimeout(() => {
    document.body.classList.add("fade-in");
  }, 100);

  // One random color per load for all stars
  const stars = document.querySelectorAll(".star");
  const color = getRandomColor();

  stars.forEach(star => {
    star.style.color = color;
  });
});

// Color palette (edit to taste)
function getRandomColor() {
  const colors = [
    "#3be2ff",
    "#3b65ffff",
    "#ff008c",
    "#fa9dd9ff",
    "#ffe600",
    "#8cff00",
    "#b388ff",
    "#ff784f"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}