$('body').on('keydown', function(e) {

  if (e.metaKey || e.ctrlKey) return;

  e.preventDefault();
  var key_code = e.which || data;
  var straight = true;

  switch (key_code) {

    // Q - P
    case 81:
      loop_short(straight);
      oscillator.init();
      break;
    case 87:
      loop_short(straight);
      oscillator.init();
      break;
    case 69:
      loop_short(straight);
      oscillator.init();
      break;
    case 82:
      loop_short(straight);
      oscillator.init();
      break;
    case 84:
      loop_short(straight);
      oscillator.init();
      break;
    case 89:
      loop_short(straight);
      oscillator.init();
      break;
    case 85:
      loop_short(straight);
      oscillator.init();
      break;
    case 73:
      loop_short(straight);
      oscillator.init();
      break;
    case 79:
      loop_short(straight);
      oscillator.init();
      break;
    case 80:
      loop_short(straight);
      oscillator.init();
      break;

    // A - L
    case 65:
      loop_short(straight)
      oscillator.init();
      break;
    case 83:
      loop_short(straight)
      oscillator.init();
      break;
    case 68:
      loop_short(straight)
      oscillator.init();
      break;
    case 70:
      loop_short(straight)
      oscillator.init();
      break;
    case 71:
      loop_short(straight)
      oscillator.init();
      break;
    case 72:
      loop_short(straight)
      oscillator.init();
      break;
    case 74:
      loop_short(straight)
      oscillator.init();
      break;
    case 75:
      loop_short(straight)
      oscillator.init();
      break;
    case 76:
      loop_short(straight)
      oscillator.init();
      break;

    // Z - M
    case 90:
      loop_short(straight);
      oscillator.init();
      break;
    case 88:
      loop_short(straight);
      oscillator.init();
      break;
    case 67:
      loop_short(straight);
      oscillator.init();
      break;
    case 86:
      loop_short(straight);
      oscillator.init();
      break;
    case 66:
      loop_short(straight);
      oscillator.init();
      break;
    case 78:
      loop_short(straight);
      oscillator.init();
      break;
    case 77:
      loop_short(straight);
      oscillator.init();
      break;

    // SPACE
    case 32:
      loop_short(straight);
      oscillator.init();
      break;

  }

});
