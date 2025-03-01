Pacman.User = function (game, map) {
    var position = null,
        direction = null,
        due = null,
        lives = null,
        score = 5,
        keyMap = {};

    keyMap[KEY.ARROW_LEFT] = LEFT;
    keyMap[KEY.ARROW_UP] = UP;
    keyMap[KEY.ARROW_RIGHT] = RIGHT;
    keyMap[KEY.ARROW_DOWN] = DOWN;

    // Add touch control variables
    var touchStartX = 0, 
        touchStartY = 0;

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

        // Add event listeners for touch controls
        var canvas = document.querySelector("canvas");
        canvas.addEventListener("touchstart", handleTouchStart, false);
        canvas.addEventListener("touchmove", handleTouchMove, false);
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

    function getNewCoord(dir, current) {
        return {
            x: current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
            y: current.y + (dir === DOWN && 2 || dir === UP && -2 || 0)
        };
    }

    function onWholeSquare(x) {
        return x % 10 === 0;
    }

    function pointToCoord(x) {
        return Math.round(x / 10);
    }

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    }

    function next(pos, dir) {
        return {
            y: pointToCoord(nextSquare(pos.y, dir)),
            x: pointToCoord(nextSquare(pos.x, dir)),
        };
    }

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    }

    function isOnSamePlane(due, dir) {
        return ((due === LEFT || due === RIGHT) &&
                (dir === LEFT || dir === RIGHT)) ||
               ((due === UP || due === DOWN) &&
                (dir === UP || dir === DOWN));
    }

    function move(ctx) {
        
        var npos = null,
            nextWhole = null,
            oldPosition = position,
            block = null;

        if (due !== direction) {
            npos = getNewCoord(due, position);

            if (isOnSamePlane(due, direction) ||
                (onGridSquare(position) &&
                 map.isFloorSpace(next(npos, due)))) {
                direction = due;
            } else {
                npos = null;
            }
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }

        if (onGridSquare(position) && map.isWallSpace(next(npos, direction))) {
            direction = NONE;
        }

        if (direction === NONE) {
            return { new: position, old: position };
        }

        if (npos.y === 100 && npos.x >= 190 && direction === RIGHT) {
            npos = { y: 100, x: -10 };
        }

        if (npos.y === 100 && npos.x <= -12 && direction === LEFT) {
            npos = { y: 100, x: 190 };
        }

        position = npos;        
        nextWhole = next(position, direction);

        block = map.block(nextWhole);

        
       // Handle eating biscuits or pills
       if ((isMidSquare(position.y) || isMidSquare(position.x)) &&
           block === Pacman.BISCUIT || block === Pacman.PILL) {

           map.setBlock(nextWhole, Pacman.EMPTY);
           addScore((block === Pacman.BISCUIT) ? 10 : 50);

           if (block === Pacman.PILL) { 
               game.eatenPill();
           }
       }   

       return { new: position, old: oldPosition };
   };

   function isMidSquare(x) { 
       var rem = x % 10;
       return rem > 3 || rem < 7;
   };

   function draw(ctx) { 
       var s     = map.blockSize; 
       ctx.fillStyle="#yellow"
   }
