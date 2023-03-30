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
let click_works = true;

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
  console.log('clickWorkspace', click_works);
  e.preventDefault()
  if (click_works) {
    clearAllSelectBoxes();
  }
  click_works = true;
};

const clickTarget = (e) => {
  if (click_works) {
    console.log('click (' + e.detail + ')');
    clearAllSelectBoxes();
    target_focus.style.backgroundColor = '#000';
  }
  click_works = true;
};

targets.forEach((target) => {
  target.addEventListener(
    'click', 
    (e) => {
      console.log('click', click_works);
      e.preventDefault()
      target_focus = target;
      clickTarget(e);
    }, 
    false
  );

  target.addEventListener(
    'dblclick', 
    (e) => {
      e.preventDefault()
      console.log('dblclick');
      isDown = true;
      target_focus = target;
      offsetX = e.offsetX
      offsetY = e.offsetY
      document.addEventListener('mousemove', move);
    },
    false
  );

  target.addEventListener(
    'mousedown',
    (e) => {
      e.preventDefault()
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
      click_works = true;
      document.removeEventListener('mousemove', move);
    },
    false
  );

  target.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      console.log('touchstart');
      target_focus = target;
      clickTarget(e);
    },
    false
  );

  target.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      console.log('touchmove');
      target_focus = target;
      move(e);
    },
    false
  );

  target.addEventListener(
    'touchend',
    (e) => {
      e.preventDefault();
      console.log('touchend');
      target_focus = target;
      clickTarget(e);
    },
    false
  );
});

workspace.addEventListener('click', clickWorkspace, true);

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