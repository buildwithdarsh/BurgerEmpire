// SVG pattern tiles — 280x280, brand-guide inspired scattered icons
// Matches the Burger Empire tray liner / wrapping paper aesthetic:
// burgers, "BB", fries, ketchup drops, drinks — minimal & airy

const classicPatternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
  <!-- Burger icon -->
  <g transform="translate(30,30) rotate(-12)" opacity="0.07">
    <path d="M0 10C0 4 5 0 13 0C21 0 26 4 26 10H0Z" fill="%23EB7A29"/>
    <rect x="0" y="11" width="26" height="3" rx="1.5" fill="%234AA056"/>
    <rect x="0" y="15" width="26" height="4" rx="2" fill="%239A1E29"/>
    <path d="M0 20H26C26 24 21 26 13 26C5 26 0 24 0 20Z" fill="%23EB7A29"/>
  </g>

  <!-- BB text -->
  <g transform="translate(160,25)" opacity="0.05">
    <text font-family="Arial Black,sans-serif" font-weight="900" font-size="22" fill="%239A1E29">BB</text>
  </g>

  <!-- Fries -->
  <g transform="translate(100,95) rotate(8)" opacity="0.06">
    <path d="M4 18L2 4H16L14 18H4Z" fill="%23EB7A29"/>
    <rect x="5" y="0" width="1.5" height="10" rx="0.7" fill="%23FFCA28"/>
    <rect x="8" y="1" width="1.5" height="11" rx="0.7" fill="%23FFCA28"/>
    <rect x="11" y="0" width="1.5" height="9" rx="0.7" fill="%23FFCA28"/>
  </g>

  <!-- Ketchup drop -->
  <g transform="translate(220,80) rotate(15)" opacity="0.06">
    <path d="M8 0C8 0 14 8 14 12C14 16 11 18 8 18C5 18 2 16 2 12C2 8 8 0 8 0Z" fill="%239A1E29"/>
  </g>

  <!-- Drink cup -->
  <g transform="translate(35,155) rotate(-5)" opacity="0.06">
    <path d="M3 6H17L15 22H5L3 6Z" fill="%23EB7A29"/>
    <rect x="2" y="3" width="16" height="4" rx="2" fill="%239A1E29"/>
    <line x1="10" y1="0" x2="10" y2="4" stroke="%239A1E29" stroke-width="1.5" stroke-linecap="round"/>
  </g>

  <!-- Small burger -->
  <g transform="translate(195,160) rotate(10)" opacity="0.06">
    <path d="M0 8C0 3 4 0 10 0C16 0 20 3 20 8H0Z" fill="%23EB7A29"/>
    <rect x="0" y="9" width="20" height="3" rx="1.5" fill="%239A1E29"/>
    <path d="M0 13H20C20 16 16 18 10 18C4 18 0 16 0 13Z" fill="%23EB7A29"/>
  </g>

  <!-- Ketchup drop small -->
  <g transform="translate(130,210) rotate(-10)" opacity="0.05">
    <path d="M5 0C5 0 9 5 9 8C9 11 7 12 5 12C3 12 1 11 1 8C1 5 5 0 5 0Z" fill="%239A1E29"/>
  </g>

  <!-- BB text small -->
  <g transform="translate(245,200)" opacity="0.04">
    <text font-family="Arial Black,sans-serif" font-weight="900" font-size="16" fill="%23EB7A29">BB</text>
  </g>

  <!-- Chicken drumstick -->
  <g transform="translate(60,240) rotate(25)" opacity="0.05">
    <ellipse cx="8" cy="6" rx="7" ry="5" fill="%23EB7A29"/>
    <rect x="6" y="10" width="4" height="8" rx="2" fill="%23D4A574"/>
  </g>

  <!-- Star accent -->
  <g transform="translate(200,260)" opacity="0.04">
    <path d="M6 0L7.5 4L12 4.5L8.5 7L9.5 11.5L6 9L2.5 11.5L3.5 7L0 4.5L4.5 4Z" fill="%23EB7A29"/>
  </g>
</svg>`;

const healthyPatternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
  <!-- Leaf -->
  <g transform="translate(30,30) rotate(-15)" opacity="0.07">
    <path d="M4 14C4 14 7 12 10 8C13 4 16 2 16 2C16 2 15 6 12 10C9 14 4 14 4 14Z" fill="%234AA056"/>
    <path d="M10 8L7 16" stroke="%233D8A48" stroke-width="0.8"/>
  </g>

  <!-- BB text -->
  <g transform="translate(160,25)" opacity="0.05">
    <text font-family="Arial Black,sans-serif" font-weight="900" font-size="22" fill="%234AA056">BB</text>
  </g>

  <!-- Avocado half -->
  <g transform="translate(95,90) rotate(5)" opacity="0.06">
    <ellipse cx="10" cy="12" rx="8" ry="10" fill="%234AA056"/>
    <ellipse cx="10" cy="13" rx="4" ry="5" fill="%2381C784"/>
    <circle cx="10" cy="14" r="2.5" fill="%235D4037"/>
  </g>

  <!-- Apple -->
  <g transform="translate(220,80) rotate(10)" opacity="0.06">
    <circle cx="8" cy="9" r="7" fill="%234AA056"/>
    <path d="M8 2L6 0" stroke="%233D8A48" stroke-width="1" stroke-linecap="round"/>
    <path d="M9 3C10 2 11 2 11 3" fill="%232E7D32"/>
  </g>

  <!-- Broccoli -->
  <g transform="translate(40,160) rotate(-8)" opacity="0.06">
    <circle cx="8" cy="5" r="4" fill="%234AA056"/>
    <circle cx="4" cy="7" r="3" fill="%233D8A48"/>
    <circle cx="12" cy="7" r="3" fill="%233D8A48"/>
    <rect x="7" y="9" width="2" height="7" rx="1" fill="%236AAF7B"/>
  </g>

  <!-- Heart -->
  <g transform="translate(195,155) rotate(8)" opacity="0.05">
    <path d="M10 4a3 3 0 00-4.2 0L5 4.8 4.2 4a3 3 0 00-4.2 4.2l.6.6L5 13.2l4.4-4.4.6-.6A3 3 0 0010 4z" fill="%234AA056"/>
  </g>

  <!-- Leaf small -->
  <g transform="translate(130,215) rotate(20)" opacity="0.05">
    <path d="M3 10C3 10 5 8 7 5C9 2 12 1 12 1C12 1 11 4 9 7C7 10 3 10 3 10Z" fill="%234AA056"/>
    <path d="M7 5L5 11" stroke="%233D8A48" stroke-width="0.6"/>
  </g>

  <!-- BB text small -->
  <g transform="translate(245,200)" opacity="0.04">
    <text font-family="Arial Black,sans-serif" font-weight="900" font-size="16" fill="%234AA056">BB</text>
  </g>

  <!-- Carrot -->
  <g transform="translate(60,245) rotate(-15)" opacity="0.05">
    <path d="M6 5L3 18L9 18L6 5Z" fill="%23FF8A65"/>
    <path d="M4 5C4 2 6 0 6 0C6 0 8 2 8 5" stroke="%234AA056" stroke-width="1" fill="none"/>
  </g>

  <!-- Seed/grain accent -->
  <g transform="translate(200,258)" opacity="0.04">
    <ellipse cx="4" cy="2" rx="4" ry="2" fill="%234AA056" transform="rotate(-20)"/>
    <ellipse cx="12" cy="3" rx="3.5" ry="1.8" fill="%234AA056" transform="rotate(15)"/>
  </g>
</svg>`;

export const classicPatternUri = `url("data:image/svg+xml,${encodeURIComponent(classicPatternSvg)}")`;
export const healthyPatternUri = `url("data:image/svg+xml,${encodeURIComponent(healthyPatternSvg)}")`;

export default function FloatingBackground() {
  return null;
}
