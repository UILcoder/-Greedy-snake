let start = document.querySelector('#start button');
let pause = document.querySelector('#pause button');
let again = document.querySelector('#again button');
let btn = document.getElementById('btn');
let score = document.getElementById('score');
let text = document.getElementById('text');
let snakewrap = document.getElementById('snakewrap');
start.onmouseover = function () {
  start.style.opacity=1
}
start.onmouseout = function () {
  start.style.opacity=0.5
}
let sw = 20,   //一个方块的宽度
    sh = 20,  //一个方块的高度
    tr = 30,  //行数
    td = 30;  //列数
    
let snake = null,direction=null,food=null;
function square (x, y, classname) {
  this.x = x * sw;
  this.y = y * sh;
  this.class = classname;
  this.view = document.createElement('div');
  this.view.className = this.class;
  this.parent = document.getElementById('snakewrap');
}

square.prototype.create = function () {
  this.view.style.position = 'absolute';
  this.view.style.width = sw + 'px';
  this.view.style.height = sh + 'px';
  this.view.style.left = this.x  + 'px';
  this.view.style.top = this.y  + 'px';
  this.parent.appendChild(this.view);
  // console.log(this.view)
}

square.prototype.remove = function () {
  this.parent.removeChild(this.view);
}
function Snake () {
  this.head = null;
  this.tail = null;
  this.pos = [];
  this.directionNum = {
    left: {
      x: -1,
      y:0
    },
    right: {
      x: 1,
      y:0
    },
    top: {
      x: 0,
      y:-1
    },
    bottom: {
      x: 0,
      y:1
    }
  }

}
Snake.prototype.init = function () {
  let snakehead = new square(2, 0, 'snakehead');
  snakehead.create();
  this.head = snakehead;
  this.pos.push([2, 0]);

  let snakebody1 = new square(1, 0, 'snakebody');
  snakebody1.create();
  this.pos.push([1, 0]);

  let snakebody2 = new square(0, 0, 'snakebody');
  this.tail = snakebody2;
  snakebody2.create();
  this.pos.push([0, 0]);

  //创建链表关系
  snakehead.last = null;
  snakehead.next = snakebody1;
  snakebody1.last = snakehead;
  snakebody1.next = snakebody2;
  snakebody2.last = snakebody1;
  snakebody2.next = null;

  this.direction=this.directionNum.right
}
Snake.prototype.getNextPos = function () {
  let nextpos = [
    this.head.x / sw + this.direction.x,
    this.head.y/sh+this.direction.y
  ]
  let flag=false
  this.pos.forEach(function (value) {
    if (nextpos[0] === value[0] && nextpos[1] === value[1]) {
      flag = true;
    }
      
     
    
  });if (flag) {
        this.strategies.die(this); return;
      }
  if (nextpos[0] < 0 || nextpos[1] < 0 || nextpos[1] > tr - 1 || nextpos[0] > td - 1) {
    this.strategies.die(this)
    return;
  };
  if (food && food.pos[0] == nextpos[0] && food.pos[1] == nextpos[1]) {
    this.strategies.eat.call(this);
    food.remove();
    createFood();
    game.score++;
    return;
  }
  
  this.strategies.move.call(this);
 
}

Snake.prototype.strategies = {
  move: function(format) {
    let newbody = new square(this.head.x / sw, this.head.y / sh, 'snakebody');
    newbody.next = this.head.next;
    newbody.next.last = newbody;
    newbody.last = null;
    this.head.remove();
    newbody.create();
   
    let newhead = new square(this.direction.x + this.head.x / sw, this.direction.y + this.head.y / sh, 'snakehead');
    newhead.last = null;
    newhead.next = newbody;
    newbody.last = newhead;
    newhead.create();
    this.pos.splice(0, 0, [this.direction.x + this.head.x / sw, this.direction.y + this.head.y / sh]);
    this.head = newhead;
    
    if (!format) {
      this.tail.remove();
      this.tail = this.tail.last;   
      this.pos.pop();
    }
  },
  eat: function () {
    this.strategies.move.call(this, true);
  },
  die: function () {
    game.over();
  }
}

snake = new Snake();

function createFood () {
  let x = null, y = null;
  let include = true;
  while (include) {
    x = Math.round(Math.random() * (td - 1));
    y = Math.round(Math.random() * (tr - 1));
    snake.pos.forEach(function (value) {
      if (x != value[0] && y!=value[1]){
        include = false;
      }
    })
  }
  food = new square(x, y, "food");
  food.pos = [x, y];
  food.create(); 
  // food.remove();
  
  
}
function Game () {
  this.timer = null;
  this.score = 0;
}
Game.prototype.init = function () {
  snake.init();
  createFood();
  document.onkeydown = function (ev) {
    if (ev.which == 37 && snake.direction != snake.directionNum.right) {
      snake.direction = snake.directionNum.left;
    }
    if (ev.which == 38 && snake.direction != snake.directionNum.bottom) {
      snake.direction = snake.directionNum.top;
    }
    if (ev.which == 39 && snake.direction != snake.directionNum.left) {
      snake.direction = snake.directionNum.right;
    }
    if (ev.which == 40 && snake.direction != snake.directionNum.top) {
      snake.direction = snake.directionNum.bottom;
    }
  }
  this.start();
}
Game.prototype.start = function () {
  this.timer = setInterval(function () {
    snake.getNextPos();
    document.getElementById('score').innerHTML = "得分：" + game.score;
  },200);
}
Game.prototype.pause = function () {
  clearInterval(this.timer);
}
Game.prototype.over = function () {
  clearInterval(this.timer);
  btn.style.display = 'none';
  score.style.top = '300px';
  again.style.display = 'block';
  text.style.display = 'block';
  snakewrap.innerHTML = '';
  snake = new Snake();
  game = new Game();
  again.onmousedown = function () {
    again.style.display = 'none';
    text.style.display = 'none';
    btn.style.display = 'block';
    start.style.display = 'block';
    score.style.top = '0px';
    
  }
  
}

let game = new Game();
start.onmousedown = function () {
  start.style.display = 'none';
  game.init();
}

snakewrap.onclick = function () {
  game.pause();
  pause.style.display = 'block';
}
pause.onmousedown = function () {
  pause.style.display = 'none';
  game.start();
}