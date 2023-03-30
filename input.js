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
let isDragStart = false;
let isMoveStart = false;
let isTouched = false;
let touch_works = true;
let isDoubleClick = false;

const moveTouch = (e) => {
  console.log('moveTouch');
  e.preventDefault();
  if (isDragStart || isMoveStart) {
    target_focus.style.left = `${e.touches[0].clientX - touchOffsetX}px`;
    target_focus.style.top = `${e.touches[0].clientY - touchOffsetY}px`;
    touch_works = false;
  }
};

const touchWorkspace = (e) => {
  console.log('touchWorkspace', isTouched, isMoveStart);
  e.preventDefault();
  if (!isTouched && !isMoveStart) {
    clearAllSelectBoxes();
  }
  touch_works = true;
  isTouched = false;
};

const touchTarget = (e) => {
  console.log('touchTarget', isTouched, touch_works);
  e.preventDefault();
  if (touch_works) {
    clearAllSelectBoxes();
    target_focus.style.backgroundColor = '#00f';
  }
  touch_works = true;
  isTouched = true;
};

const doubleTouchTarget = (e) => {
  console.log('doubleTouchTarget');
  e.preventDefault();
  isMoveStart = true;
  isDoubleClick = true;
  document.getElementById('debug').innerText = touchOffsetX;
  document.addEventListener('touchmove', moveTouch);
};

let lastClick = 0;
targets.forEach((target) => {
  target.addEventListener(
    'touchstart',
    (e) => {
      console.log('touchstart');
      e.preventDefault();
      let date = new Date();
      let time = date.getTime();
      const time_between_taps = 200; // 200ms
      isDragStart = true;
      isTouched = false;
      target_focus = target;
      touchOffsetX = e.touches[0].clientX - target.offsetLeft;
      touchOffsetY = e.touches[0].clientY - target.offsetTop;

      if (time - lastClick < time_between_taps) {
        doubleTouchTarget(e);
      }
      lastClick = time;
    },
    false
  );

  target.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      // console.log('touchmove');
      target_focus = target;
      moveTouch(e);
    },
    false
  );

  target.addEventListener(
    'touchend',
    (e) => {
      console.log('touchend');
      e.preventDefault();
      touchTarget(e);
    },
    false
  );
});

let lastClickWS = 0;
workspace.addEventListener(
  'touchstart',
  (e) => {
    console.log('ws touchstart');
    e.preventDefault();
    let date = new Date();
    lastClickWS = date.getTime();
  },
  false
);

workspace.addEventListener(
  'touchend',
  (e) => {
    console.log('ws touchstart', isMoveStart);
    e.preventDefault();
    if (!isDoubleClick && isMoveStart) {
      let date = new Date();
      let time = date.getTime();
      console.log(time - lastClickWS);
      if (time - lastClickWS < 200) {
        console.log('ws touchstart cancel');
        isMoveStart = false;
        isDoubleClick = false;
        document.removeEventListener('touchmove', moveTouch);
      }
    } else {
      touchWorkspace(e);
      isDoubleClick = false;
    }
  },
  false
);

// workspace.addEventListener('touchend', touchWorkspace, false);
