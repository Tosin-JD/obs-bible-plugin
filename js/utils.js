function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');

  let red = parseInt(hex.substring(0, 2), 16);
  let green = parseInt(hex.substring(2, 4), 16);
  let blue = parseInt(hex.substring(4, 6), 16);

  alpha = parseFloat(alpha);
  if (isNaN(alpha) || alpha < 0 || alpha > 1) {
    alpha = 1;
  }
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}