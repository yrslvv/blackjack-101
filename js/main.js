window.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});


// Handles app exit to a static message (closing tab is user action).
function closeApp() {
  const app = document.getElementById('app');
  app.classList.remove('fade-in');
  app.classList.add('fade-out');

  setTimeout(() => {
    app.innerHTML = '<h2>Thanks for playing!</h2><p>You may now close this tab.</p>';
    app.classList.remove('fade-out');
    app.classList.add('fade-in');
  }, 500);
}

// Returns from the game to the Main Menu.
// Resets background and shows the menu again.
 
function exitToMainMenu() {
  document.body.style.backgroundColor = '#0b132b'; // reset to dark
  showMainMenu();
}
