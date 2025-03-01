var NONE = 4,
    UP = 3,
    LEFT = 2,
    DOWN = 1,
    RIGHT = 11,
    WAITING = 5,
    PAUSE = 6,
    PLAYING = 7,
    COUNTDOWN = 8,
    EATEN_PAUSE = 9,
    DYING = 10,
    Pacman = {};

Pacman.FPS = 30;

Pacman.User = function (game, map) {
    var position = null,
        direction = null,
        due = null,
        lives = null,
        score = 5,
        keyMap = {};

    keyMap[37] = LEFT; // Arrow Left
    keyMap[38] = UP; // Arrow Up
    keyMap[39] = RIGHT; // Arrow Right
    keyMap[40] = DOWN; // Arrow Down

    // Add touch control variables
    var touchStartX = 0, touchStartY = 0;

    function addScore(nScore) {
        score += nScore;
        if (score >= 10000 && score - nScore < 10000) {
            lives += 1;
        }
    }

    function theScore() {
        return score;
    }

    function loseLife() {
        lives -= 1;
    }

    function getLives() {
        return lives;
    }

    function initUser() {
        score = 0;
        lives = 3;
        newLevel();

        // Add event listeners for swipe controls
        var canvas = document.querySelector("canvas");
        canvas.addEventListener("touchstart", handleTouchStart, false);
        canvas.addEventListener("touchmove", handleTouchMove, false);

        // Add event listeners for button controls
        document.getElementById("up").addEventListener("click", () => handleMobileInput("up"));
        document.getElementById("down").addEventListener("click", () => handleMobileInput("down"));
        document.getElementById("left").addEventListener("click", () => handleMobileInput("left"));
        document.getElementById("right").addEventListener("click", () => handleMobileInput("right"));
    }

    function newLevel() {
        resetPosition();
    }

    function resetPosition() {
        position = { x: 90, y: 120 };
        direction = LEFT;
        due = LEFT;
    }

    function reset() {
        initUser();
        resetPosition();
    }

    function keyDown(e) {
        if (typeof keyMap[e.keyCode] !== "undefined") {
            due = keyMap[e.keyCode];
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return true;
    }

    // Handle touch start
    function handleTouchStart(e) {
        var touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    // Handle touch move (detect swipe direction)
    function handleTouchMove(e) {
        if (!touchStartX || !touchStartY) return;

        var touchEndX = e.touches[0].clientX;
        var touchEndY = e.touches[0].clientY;

        var diffX = touchEndX - touchStartX;
        var diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            due = diffX > 0 ? RIGHT : LEFT;
        } else {
            // Vertical swipe
            due = diffY > 0 ? DOWN : UP;
        }

        // Reset starting points
        touchStartX = 0;
        touchStartY = 0;

        e.preventDefault();
    }

    // Handle button input for mobile controls
    window.handleMobileInput = function (direction) {
        switch (direction) {
            case "up":
                due = UP;
                break;
            case "down":
                due = DOWN;
                break;
            case "left":
                due = LEFT;
                break;
            case "right":
                due = RIGHT;
                break;
            default:
                console.warn(`Unknown direction: ${direction}`);
                break;
        }
    };

    function getNewCoord(dir, current) {
        return {
            x: current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
            y: current.y + (dir === DOWN && 2 || dir === UP && -2 || 0)
        };
    }

   // The rest of your movement logic and game rendering remains unchanged...
};
