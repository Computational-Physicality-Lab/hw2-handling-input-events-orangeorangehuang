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

// Touch Events

let touchOffsetX = 0;
let touchOffsetY = 0;
let originalOffsetX = 0;
let originalOffsetY = 0;
let touchFocusTarget = null;
let touchState = 'pending';
// touchState:
// pending
// touchingTarget
// focused
// resizing
// doubleTouchingTarget: Double clicked but not yet start moving
// movingTarget
// dragingTarget

const touchMove = (e) => {
  e.preventDefault();
  console.log('touchMove');

  if (touchState === 'movingTarget' || touchState === 'dragingTarget') {
    touchFocusTarget.style.left = `${e.touches[0].clientX - touchOffsetX}px`;
    touchFocusTarget.style.top = `${e.touches[0].clientY - touchOffsetY}px`;
  }
};

let lastClick = 0;
targets.forEach((target) => {
  target.addEventListener(
    'touchstart',
    (e) => {
      console.log('touchstart');
      e.preventDefault();
      touchFocusTarget = target;

      touchOffsetX = e.touches[0].clientX - target.offsetLeft;
      touchOffsetY = e.touches[0].clientY - target.offsetTop;
      originalOffsetX = target.offsetLeft;
      originalOffsetY = target.offsetTop;
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
        touchFocusTarget.style.backgroundColor = '#00f';
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

let touchStartTimeWS = 0;
workspace.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    console.log('WS touchstart');

    let date = new Date();
    touchStartTimeWS = date.getTime();

    if (touchState === 'focused') {
      document.getElementById('debug').innerText = e.touches[0];
      console.log(e.touches[0])
      if (e.touches.length == 2) {
        // Resize
        document.getElementById('debug').innerText = 'Resizing:' + e.touches[1];
        touchState = "resizing"
      } else if (e.touches.length == 1) {
        // Resize
        // document.getElementById('debug').innerText = 'Resizing:' + e.touches.length;
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
    let date = new Date();
    let time = date.getTime();
    console.log('ws touchend :', time - touchStartTimeWS, touchState);

    if (touchState === 'doubleTouchingTarget') {
      touchState = 'movingTarget';
    } else if (touchState === 'movingTarget') {
      document.getElementById('debug').innerText = e.touches.length;
      if (e.touches.length >= 1) {
        // Abort
        touchFocusTarget.style.left = `${originalOffsetX}px`;
        touchFocusTarget.style.top = `${originalOffsetY}px`;
        // touchState = 'focused';
        // touchFocusTarget = null;
        // clearAllSelectBoxes();
      } 
      else if (time - touchStartTimeWS < 200) {
        touchState = 'pending';
        touchFocusTarget = null;
        clearAllSelectBoxes();
        document.removeEventListener('touchmove', touchMove);
      }
    } else if (touchState === 'dragingTarget') {
      document.getElementById('debug').innerText = e.touches.length;
      if (e.touches.length >= 1) {
        // Abort
        touchFocusTarget.style.left = `${originalOffsetX}px`;
        touchFocusTarget.style.top = `${originalOffsetY}px`;
        touchFocusTarget = null;
        clearAllSelectBoxes();
      } else {
        touchState = 'pending';
      }
    } else if (touchState === 'touchingTarget') {
      touchState = 'focused';
    } else if (touchState === 'focused') {
      clearAllSelectBoxes();
      touchState = 'pending';
    } else if (touchState === 'resizing') {
      document.getElementById('debug').innerText = e.touches.length;
      if (e.touches.length == 1) {
        // Resize
        document.getElementById('debug').innerText = 'Resizing:' + e.touches.length;
      } else if (e.touches.length == 0) {
        touchState = "focused";
      }
    } else if (touchState === 'pending') {
      clearAllSelectBoxes();
      touchState = 'pending';
    }
  },
  false
);

// let lastClickWS = 0;
// workspace.addEventListener(
//   'touchstart',
//   (e) => {
//     console.log('ws touchstart');
//     e.preventDefault();
//     let date = new Date();
//     lastClickWS = date.getTime();
//   },
//   false
// );

// workspace.addEventListener(
//   'touchend',
//   (e) => {
//     console.log('ws touchstart', isMoveStart);
//     e.preventDefault();
//     if (!isDoubleClick && isMoveStart) {
//       let date = new Date();
//       let time = date.getTime();
//       console.log(time - lastClickWS);
//       if (time - lastClickWS < 200) {
//         console.log('ws touchstart cancel');
//         isMoveStart = false;
//         isDoubleClick = false;
//         document.removeEventListener('touchmove', moveTouch);
//       }
//     } else {
//       touchWorkspace(e);
//       isDoubleClick = false;
//     }
//   },
//   false
// );

// workspace.addEventListener('touchend', touchWorkspace, false);
