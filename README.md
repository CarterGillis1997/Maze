JavaScript Maze Generation (Depth First Search) Tutorial
https://www.youtube.com/watch?v=nHjqkLV_Tp0

Beyond the tutorial I added the ability to navigate the maze. The navigation was done by creating an svg to layer on top of the canvas used for the actual maze generation and then tying the logic of the maze to the controls added after generation.
Using the SVG is beneficial because it allowed me to have complete control over the "player" without affecting anyting on the actual canvas. This way i could add or remove anything i want to the screen and the canvas would remain the same.
I plan to add more functionality such as a goal to reach and randomized start position.
