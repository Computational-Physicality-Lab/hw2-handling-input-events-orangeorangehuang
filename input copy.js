/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const targets = document.querySelectorAll('.target');
const workspace = document.querySelector('#workspace');

let target_focus = null;
let offsetX = 0;
let offsetY = 0;
let originalX = 0;
let originalY = 0;
let isDown = false;
let isClicked = false; // won't reset targets when click workspace
let click_works = true; // won't change color after moving

const clearAllSelectBoxes = () => {
  targets.forEach((target) => {
    target.style.backgroundColor = 'red';
  });
};

const move = (e) => {
  e.preventDefault();
  if (isDown) {
    target_focus.style.left = `${e.pageX - offsetX}px`;
    target_focus.style.top = `${e.pageY - offsetY}px`;
    click_works = false;
  }
};

const resetMove = (e) => {
  e.preventDefault();
  if (isDown) {
    target_focus.style.left = `${originalX}px`;
    target_focus.style.top = `${originalY}px`;
    isDown = false;
  }
};

const clickWorkspace = (e) => {
  console.log('clickWorkspace', click_works, isClicked);
  e.preventDefault();
  if (!isClicked) {
    clearAllSelectBoxes();
  }
  click_works = true;
  isClicked = false;
};

const clickTarget = (e) => {
  e.preventDefault();
  if (click_works) {
    console.log('click (' + e.detail + ')');
    clearAllSelectBoxes();
    target_focus.style.backgroundColor = '#00f';
  }
  click_works = true;
  isClicked = true;
};

const doubleClickTarget = (e) => {
  e.preventDefault();
  isDown = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
  document.addEventListener('mousemove', move);
};

targets.forEach((target) => {
  target.addEventListener(
    'click',
    (e) => {
      console.log('click', click_works);
      e.preventDefault();
      target_focus = target;
      clickTarget(e);
    },
    false
  );

  target.addEventListener(
    'dblclick',
    (e) => {
      console.log('dblclick');
      e.preventDefault();
      target_focus = target;
      doubleClickTarget(e);
    },
    false
  );

  target.addEventListener(
    'mousedown',
    (e) => {
      e.preventDefault();
      console.log('mousedown');
      isDown = true;
      target_focus = target;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      originalX = e.pageX - offsetX;
      originalY = e.pageY - offsetY;
      document.addEventListener('mousemove', move);
    },
    false
  );

  target.addEventListener(
    'mouseup',
    (e) => {
      e.preventDefault();
      console.log('mouse up');
      isDown = false;
      // click_works = true;
      document.removeEventListener('mousemove', move);
    },
    false
  );
});

workspace.addEventListener('click', clickWorkspace, false);

document.addEventListener(
  'keydown',
  (e) => {
    console.log('keydown');
    e.preventDefault();
    if (e.key === 'Escape' || e.key === 'Esc') {
      console.log('esc');
      resetMove(e);
      return false;
    }
  },
  false
);

// 
// 
// 
// 
// 
// 
// 
// 
// Touch Events

let touchOffsetX = 0;
let touchOffsetY = 0;
let originalOffsetX = 0;
let originalOffsetY = 0;
let resizeOffsetX = 0;
let resizeOffsetY = 0;
let originalWidth = 0;
let originalHeight = 0;
let resizeWidth = 0;
let resizeHeight = 0;
let touchFocusTarget = null;
let touchOperatingTarget = null;
let touchState = 'pending';
// touchState:
//    pending
//    touchingTarget: Touched but no further changes
//    focused
//    resizing
//    doubleTouchingTarget: Double touched but not yet start moving
//    movingTarget
//    dragingTarget


// Target Part

const touchMove = (e) => {
  e.preventDefault();
  if (touchState === 'movingTarget' || touchState === 'dragingTarget') {
    touchOperatingTarget.style.left = `${e.touches[0].clientX - touchOffsetX}px`;
    touchOperatingTarget.style.top = `${e.touches[0].clientY - touchOffsetY}px`;
    resizeOffsetX = e.touches[0].clientX - touchOffsetX;
    resizeOffsetY = e.touches[0].clientY - touchOffsetY;
  }
};

let lastClick = 0;
targets.forEach((target) => {
  target.addEventListener(
    'touchstart',
    (e) => {
      console.log('touchstart');
      e.preventDefault();
      touchOperatingTarget = target;

      touchOffsetX = e.touches[0].clientX - target.offsetLeft;
      touchOffsetY = e.touches[0].clientY - target.offsetTop;
      originalOffsetX = target.offsetLeft;
      originalOffsetY = target.offsetTop;
      resizeOffsetX = target.offsetLeft;
      resizeOffsetY = target.offsetTop;
      resizeWidth = target.offsetWidth;
      resizeHeight = target.offsetHeight;
      originalWidth = target.offsetWidth;
      originalHeight = target.offsetHeight;
    },
    false
  );

  target.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      console.log('touchmove');
      touchState = 'dragingTarget';
      touchMove(e);
    },
    false
  );

  target.addEventListener(
    'touchend',
    (e) => {
      console.log('touchend');
      e.preventDefault();

      // touch
      console.log('touchState', touchState);
      if (touchState == 'pending' || touchState == 'focused' || touchState === 'movingTarget') {
        clearAllSelectBoxes();
        touchOperatingTarget.style.backgroundColor = '#00f';
        touchFocusTarget = touchOperatingTarget;
        touchState = 'touchingTarget';
      }

      //double touch
      let date = new Date();
      let time = date.getTime();
      const time_between_taps = 200; // 200ms
      if (time - lastClick < time_between_taps) {
        console.log('double Touch', touchState);
        touchState = 'doubleTouchingTarget';
        document.addEventListener('touchmove', touchMove);
      }
      lastClick = time;
    },
    false
  );
});


// Workspace Part

let touchStartTimeWS = 0;
let touchResizingTimeWS = 0;
let touchResizeX1 = 0;
let touchResizeY1 = 0;
let touchResizeX2 = 0;
let touchResizeY2 = 0;

const touchResizing = (e) => {
  if (touchState != "resizing") return;
  let dx_init = (touchResizeX1 - touchResizeX2 > 0)? touchResizeX1 - touchResizeX2: touchResizeX2 - touchResizeX1;
  let dy_init = (touchResizeY1 - touchResizeY2 > 0)? touchResizeY1 - touchResizeY2: touchResizeY2 - touchResizeY1;
  let direction = (dx_init > dy_init)? "x" : "y";
  let x1 = e.touches[0].clientX;
  let y1 = e.touches[0].clientY;
  let x2 = e.touches[1].clientX;
  let y2 = e.touches[1].clientY;
  let dx = (x1 - x2 > 0)? (x1 - x2 - dx_init)/10: (x2 - x1 - dx_init)/10;
  let dy = (y1 - y2 > 0)? (y1 - y2 - dy_init)/10: (y2 - y1 - dy_init)/10;

  if (direction == "x") {
    let x_prime = resizeOffsetX - dx/2;
    let width_prime = resizeWidth + dx;
    if (x_prime >= 0 && x_prime + width_prime <= window.innerWidth && width_prime > 20){
      touchFocusTarget.style.left = `${x_prime}px`;
      touchFocusTarget.style.width = `${width_prime}px`;
      resizeOffsetX = x_prime;
      resizeWidth = width_prime;
    } 
  } else {
    let y_prime = resizeOffsetY - dy/2;
    let height_prime = resizeHeight + dy;
    if (y_prime >= 0 && y_prime + height_prime <= window.innerHeight && height_prime > 20){
      touchFocusTarget.style.top = `${y_prime}px`;
      touchFocusTarget.style.height = `${height_prime}px`;
      resizeOffsetY = y_prime;
      resizeHeight = height_prime;
    } 
  }
};

workspace.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    console.log("WS touchstart");
    let date = new Date();
    let time = date.getTime(); 
    touchStartTimeWS = time;

    if (touchState === 'focused' || touchState === 'resizing') {
      console.log(e.touches[0])
      touchResizingTimeWS = time;
      if (e.touches.length == 1) {
        // Before Resize
        touchResizeX1 = e.touches[0].clientX;
        touchResizeY1 = e.touches[0].clientY;
      } else if (e.touches.length == 1 && time - touchStartTimeWS < 200) {
        // Resize
        touchResizeX2 = e.touches[0].clientX;
        touchResizeY2 = e.touches[0].clientY;
        workspace.addEventListener("touchmove", touchResizing, false);
        touchState = "resizing"
      } else if (e.touches.length == 2) {
        // Resize
        touchResizeX1 = e.touches[0].clientX;
        touchResizeY1 = e.touches[0].clientY;
        touchResizeX2 = e.touches[1].clientX;
        touchResizeY2 = e.touches[1].clientY;
        workspace.addEventListener("touchmove", touchResizing, false);
        touchState = "resizing"
      } else if (e.touches.length == 3) {
        // Abort
        touchFocusTarget.style.left = `${originalOffsetX}px`;
        touchFocusTarget.style.top = `${originalOffsetY}px`;
        touchFocusTarget.style.width = `${originalWidth}px`;
        touchFocusTarget.style.height = `${originalHeight}px`;
        touchState = "pending";
       
      } else {
        clearAllSelectBoxes();
        touchState = 'pending';
      }
    }
  },
  false
);

workspace.addEventListener(
  'touchend',
  (e) => {
    e.preventDefault();
    console.log("WS touchend");
    let date = new Date();
    let time = date.getTime();

    if (touchState === 'doubleTouchingTarget') {
      touchState = 'movingTarget';
    } else if (touchState === 'movingTarget') {
      if (e.touches.length >= 1) {
        // Abort
        touchFocusTarget.style.left = `${originalOffsetX}px`;
        touchFocusTarget.style.top = `${originalOffsetY}px`;
        touchState = 'focused';
      } 
      else if (time - touchStartTimeWS < 200) {
        touchState = 'pending';
        originalOffsetX = touchFocusTarget.offsetLeft;
        originalOffsetY = touchFocusTarget.offsetTop;
        touchFocusTarget = null;
        clearAllSelectBoxes();
        document.removeEventListener('touchmove', touchMove);
      }
    } else if (touchState === 'dragingTarget') {
      if (e.touches.length >= 1) {
        // Abort
        touchOperatingTarget.style.left = `${originalOffsetX}px`;
        touchOperatingTarget.style.top = `${originalOffsetY}px`;
        resizeOffsetX = originalOffsetX;
        resizeOffsetY = originalOffsetY;
        // touchOperatingTarget = null;
        // clearAllSelectBoxes();
        document.removeEventListener('touchmove', touchMove);
        if (touchFocusTarget !== null) {
          touchState = 'focused';
        } else {
          touchState = 'pending';
        }
        
      }
      //  else if (touchOperatingTarget != null) {
      //   originalOffsetX = touchOperatingTarget.offsetLeft;
      //   originalOffsetY = touchOperatingTarget.offsetTop;
      //   touchState = 'focused';
      // } else {
      //   originalOffsetX = touchOperatingTarget.offsetLeft;
      //   originalOffsetY = touchOperatingTarget.offsetTop;
      //   touchState = 'pending';
      // }
    } else if (touchState === 'touchingTarget') {
      touchState = 'focused';
    } 
    else if (touchState === 'focused') {
      clearAllSelectBoxes();
      touchState = 'pending';
    } 
    else if (touchState === 'resizing') {
      if (e.touches.length == 0) {
        touchState = "focused";
      }
    } else if (touchState === 'pending') {
      clearAllSelectBoxes();
      touchState = 'pending';
    }
  },
  false
);