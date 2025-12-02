# The Game of Life by Conway

## Project Overview

This project is a reproduction of **Conway's Game of Life**, a zero-player mathematical game created by the British mathematician John Horton Conway in 1970.

The project uses the **p5.js** library to create a dynamic, browser-based simulation of this fascinating cellular automaton.

---

## Getting Started

To run this project, you simply need a web browser. The core logic is handled by p5.js and runs locally.

### Project Structure
├── index.html # Main HTML file to load the simulation 
├── styles.css # Stylesheet for background and canvas 
├── script.js # p5.js logic for The Game of Life 
└── assets/ 
    └── background.jpg # Custom background image

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/axelio-dev/GameOfLife.git](https://github.com/axelio-dev/GameOfLife.git)
    cd game-of-life
    ```

2.  **Open `index.html`:**
    Simply open the `index.html` file in your preferred web browser. No server setup is required, as p5.js is loaded via CDN.

3.  **Interaction:**
    * Click on the canvas to manually toggle cells (bring them to life or kill them).
    * The simulation runs automatically based on the rules.

---

## The Rules of Life

The Game of Life takes place on an infinite two-dimensional grid of square cells. Each cell has one of two possible states: **live** or **dead**. The state of the grid evolves over time based on the states of its neighbors, following four simple rules:

### **Survival & Death**

1.  **Underpopulation (Isolation):** Any live cell with fewer than two live neighbors dies (as if by isolation).
2.  **Survival:** Any live cell with two or three live neighbors lives on to the next generation.
3.  **Overpopulation:** Any live cell with more than three live neighbors dies (as if by overpopulation).

### **Reproduction**

4.  **Birth (Reproduction):** Any dead cell with exactly three live neighbors becomes a live cell (as if by reproduction).

## Technologies Used

| Domain | Technology | Notes |
| Simulation | p5.js | A JavaScript library for creative coding and graphics. |
| Frontend | HTML5 / CSS3 | Standard web technologies for structure and style. |
| Media | `background.jpg` | Custom element for an aesthetic background (Royalty-free image). |

---

## Credits

This project was developed during a **Coding Club** session at **Epitech**, School of Computer Science.

* **Developer:** Axelio-dev
* **Institution:** Epitech Coding Club