export let clubs = <svg width="100" height="100" viewBox="0,0,100,100">
<circle cx="50" cy="28" r="18" stroke="black" stroke-width="4" fill="black"></circle>
      <circle cx="30" cy="55" r="18" stroke="black" stroke-width="4" fill="black"></circle>
      <circle cx="70" cy="55" r="18" stroke="black" stroke-width="4" fill="black"></circle>
  <path fill="black" d="M60,70 C 50,70 50,90 70,95 L 70,100 30,100 30,95 C50,90 50,70 40,70 L50,48 Z" stroke="black"></path>
</svg>


export let spades = <svg width="100" height="100" viewBox="0,0,100,100">
<path fill="black" d="M50,75 C100,85 90,33 50,2"></path>
<path fill="black" d="M50,75 C0,85 10,33 50,2"></path>
  <path fill="black" d="M60,70 C 50,70 50,90 70,95 L 70,100 30,100 30,95 C50,90 50,70 40,70 L50,48 Z" stroke="black"></path>
</svg>

export let hearts = <svg width="100" height="100" viewBox="0,0,100,100">
<path fill="red" d="M50,100 C120,40 80,-20 50,30"></path>
<path fill="red" d="M50,100 C-20,40 20,-20 50,30"></path>
</svg>

export let diamonds = <svg width="100" height="100" viewBox="0,0,100,100">
<polygon points="50,0 90,50, 50,100 10,50" fill="red"></polygon>
</svg>


export default {clubs, spades, hearts, diamonds}