var NONE = 4,
    UP = 3,
    LEFT = 2,
    DOWN = 1,
    RIGHT = 11;

Pacman.User = function (game, map) {
    var position = null,
        direction = null,
        due = null,
        keyMap = {};

    keyMap[37] = LEFT; // Arrow Left
    keyMap[38] = UP; // Arrow Up
    keyMap[39] = RIGHT; // Arrow Right
    keyMap[40] = DOWN; // Arrow Down

    // Touch control variables
    var touchStartX = null, touchStartY = null;

    function initUser() {
        resetPosition();

        // Add swipe event listeners
        var canvas = document.querySelector("#pacman");
        canvas.addEventListener("touchstart", handleTouchStart, false);
        canvas.addEventListener("touchmove", handleTouchMove, false);

        // Add button event listeners
        document.getElementById("up").addEventListener("click", () => handleMobileInput(UP));
        document.getElementById("down").addEventListener("click", () => handleMobileInput(DOWN));
        document.getElementById("left").addEventListener("click", () => handleMobileInput(LEFT));
        document.getElementById("right").addEventListener("click", () => handleMobileInput(RIGHT));
    }

    function resetPosition() {
        position = { x: 90, y: 120 };
        direction = LEFT;
        due = LEFT;
    }

    function handleTouchStart(e) {
        var touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchMove(e) {
        if (!touchStartX || !touchStartY) return;

        var touchEndX = e.touches[0].clientX;
        var touchEndY = e.touches[0].clientY;

        var diffX = touchEndX - touchStartX;
        var diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            due = diffX > 0 ? RIGHT : LEFT;
        } else {
            due = diffY > 0 ? DOWN : UP;
        }

        touchStartX = null;
        touchStartY = null;

        e.preventDefault();
    }

    function handleMobileInput(directionInput) {
        due = directionInput;
    }

    return {
        initUser,
        resetPosition,
        handleTouchStart,
        handleTouchMove,
        handleMobileInput,
    };
};

document.addEventListener("DOMContentLoaded", function () {
    const pacmanUser = new Pacman.User();
    pacmanUser.initUser();
});
