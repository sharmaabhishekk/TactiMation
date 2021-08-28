body = document.body
//canvas variables
var canvas = document.getElementById('pitch');
var ctx = canvas.getContext('2d');

//control panel vars
var oppositionInput = document.querySelector('input#opposition-team');
var jdpInput = document.querySelector('input#jdp');
var resetButton = document.querySelector("button.reset");
var startStopButton = document.querySelector("button.startstop");
var playBackButton = document.querySelector("button.play");
var delayValue = parseFloat(document.querySelector("input.delay-slider").value)
var saveButton  = document.querySelector("button.save")

//player and ball vars
var leftPlayers = document.querySelectorAll(".circle.left");
var rightPlayers = document.querySelectorAll(".circle.right");
var ball = document.querySelector(".circle.ball");
var draggables = [...leftPlayers, ...rightPlayers, ball];

const N = 30;

let draggablesCoordsObj = new Map();
for (i=0; i<draggables.length; i++) {
  draggablesCoordsObj.set(draggables[i], {x:[], y:[], plotXs: [], plotYs: []})
}

function drawPitch() {
    
  // Outer lines
  ctx.beginPath();
  ctx.rect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = "#53c653";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#FFF";
  ctx.stroke();
  ctx.closePath();
  
  ctx.fillStyle = "#FFF";
  
  // Mid line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.closePath();
  
  //Mid circle
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, 73, 0, 2*(Math.PI), false);
  ctx.stroke();
  ctx.closePath();
  //Mid point
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2*Math.PI, false);
  ctx.fill();
  ctx.closePath();
  
  //Home penalty box
  ctx.beginPath();
  ctx.rect(0, (canvas.height - 322) / 2, 132, 322);
  ctx.stroke();
  ctx.closePath();
  //Home goal box
  ctx.beginPath();
  ctx.rect(0, (canvas.height - 146) / 2, 44, 146);
  ctx.stroke();
  ctx.closePath();
  //Home goal 
  ctx.beginPath();
  ctx.moveTo(1, (canvas.height / 2) - 22);
  ctx.lineTo(1, (canvas.height / 2) + 22);
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;

  //Home penalty point
  ctx.beginPath()
  ctx.arc(88, canvas.height / 2, 1, 0, 2*Math.PI, true);
  ctx.fill();
  ctx.closePath();
  //Home half circle
  ctx.beginPath()
  ctx.arc(88, canvas.height / 2, 73, 0.29*Math.PI, 1.71*Math.PI, true);
  ctx.stroke();
  ctx.closePath();
  
  //Away penalty box
  ctx.beginPath();
  ctx.rect(canvas.width-132, (canvas.height - 322) / 2, 132, 322);
  ctx.stroke();
  ctx.closePath();
  //Away goal box
  ctx.beginPath();
  ctx.rect(canvas.width-44, (canvas.height - 146) / 2, 44, 146);
  ctx.stroke();
  ctx.closePath();      
  //Away goal 
  ctx.beginPath();
  ctx.moveTo(canvas.width-1, (canvas.height / 2) - 22);
  ctx.lineTo(canvas.width-1, (canvas.height / 2) + 22);
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;
  //Away penalty point
  ctx.beginPath()
  ctx.arc(canvas.width-88, canvas.height / 2, 1, 0, 2*Math.PI, true);
  ctx.fill();
  ctx.closePath();
  //Away half circle
  ctx.beginPath()
  ctx.arc(canvas.width-88, canvas.height / 2, 73, 0.71*Math.PI, 1.29*Math.PI, false);
  ctx.stroke();
  ctx.closePath();
        
  //Home L corner
  ctx.beginPath()
  ctx.arc(0, 0, 8, 0, 0.5*Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  //Home R corner
  ctx.beginPath()
  ctx.arc(0, canvas.height, 8, 0, 2*Math.PI, true);
  ctx.stroke();
  ctx.closePath();
  //Away R corner
  ctx.beginPath()
  ctx.arc(canvas.width, 0, 8, 0.5*Math.PI, 1*Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  //Away L corner
  ctx.beginPath()
  ctx.arc(canvas.width, canvas.height, 8, 1*Math.PI, 1.5*Math.PI, false);
  ctx.stroke();
  ctx.closePath();

  ctx.font = "30px Poppins";
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.textAlign = "center";
  ctx.fillText("TactiMation", 700, 510);
}

function addPlayersAndBall() {
  // 4-3-3: gk lb lcb rcb rb lmf cmf rmf lw st rw
  leftXs = [150, 444, 415, 430, 543, 556, 486, 532, 627, 640, 597];
  leftYs = [259, 172, 297, 434, 510, 166, 259, 346, 126, 248, 398];
  // 4-4-2: gk rb rcb lcb lb rw rmf lmf lw lf rf
  rightXs = [723, 654, 659, 659, 660, 606, 613, 613, 598, 531, 521];
  rightYs = [259, 142, 210, 284, 358, 144, 202, 284, 338, 202, 316];

  ballX = 454;
  ballY = 181;

  for (i=0; i<leftXs.length; i++) {
    leftPlayers[i].style.top = leftYs[i]+"px";
    leftPlayers[i].style.left = leftXs[i]+"px";
  }  

  for (i=0; i<rightXs.length; i++) {
    rightPlayers[i].style.top = rightYs[i]+"px";
    rightPlayers[i].style.left = rightXs[i]+"px";
  }

  //ball 
  ball.style.top = ballY+"px";
  ball.style.left = ballX+"px";

}

function juegoDePosicion() {
  ctx.fillStyle = "#FFF";
  ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
  
  // h1
  ctx.beginPath();
  ctx.moveTo(132, (canvas.height - 322) / 2);
  ctx.lineTo(canvas.width - 132, (canvas.height - 322) / 2);
  ctx.stroke();
  ctx.closePath();

  // h2
  ctx.beginPath();
  ctx.moveTo(132, (canvas.height - 146) / 2);
  ctx.lineTo(canvas.width - 132, (canvas.height - 146) / 2);
  ctx.stroke();
  ctx.closePath();

  // h3
  ctx.beginPath();
  ctx.moveTo(132, 332);
  ctx.lineTo(canvas.width - 132, 332);
  ctx.stroke();
  ctx.closePath(); 

  // h4
  ctx.beginPath();
  ctx.moveTo(132, canvas.height-98);
  ctx.lineTo(canvas.width - 132, canvas.height-98);
  ctx.stroke();
  ctx.closePath();

  // v1
  ctx.beginPath();
  ctx.moveTo(132, canvas.width);
  ctx.lineTo(132, canvas.height - 98);
  ctx.stroke();
  ctx.closePath();  

  // v2
  ctx.beginPath();
  ctx.moveTo(132, 0);
  ctx.lineTo(132, 98);
  ctx.stroke();
  ctx.closePath();  

  // v3
  ctx.beginPath();
  ctx.moveTo(canvas.width - 132, 0);
  ctx.lineTo(canvas.width - 132, 98);
  ctx.stroke();
  ctx.closePath();  

  // v4
  ctx.beginPath();
  ctx.moveTo(canvas.width - 132, canvas.height);
  ctx.lineTo(canvas.width - 132, canvas.height - 98);
  ctx.stroke();
  ctx.closePath();  

  // v5
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 132, 0);
  ctx.lineTo(canvas.width/2 - 132, 98);
  ctx.stroke();
  ctx.closePath(); 

  // v6
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 132, canvas.height);
  ctx.lineTo(canvas.width/2 - 132, canvas.height - 98);
  ctx.stroke();
  ctx.closePath(); 

  // v7
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 + 132, 0);
  ctx.lineTo(canvas.width/2 + 132, 98);
  ctx.stroke();
  ctx.closePath(); 

  // v8
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 + 132, canvas.height);
  ctx.lineTo(canvas.width/2 + 132, canvas.height - 98);
  ctx.stroke();
  ctx.closePath();       
  ctx.setLineDash([]);

}
//controls event listeners

//record stop button
startStopButton.addEventListener("click", (event) => {
  if (startStopButton.classList.contains("stop")) {
    startStopButton.classList.remove("stop")
  } else if (!startStopButton.classList.contains("stop")){
    startStopButton.classList.add("stop")
  }

  let titleText
  style = startStopButton.currentStyle || window.getComputedStyle(startStopButton, false)
  bg_image_url = style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
  bg_image_url.includes("record.png") ? titleText = "Start Recording Animation" : titleText = "Stop Recording Animation"
  startStopButton.title = titleText
})

//reset button
resetButton.addEventListener('click', (event) => {
  location.reload()
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  // drawPitch()
  // addPlayersAndBall()

  // startStopButton.title = "Start Recording Animation"

  // for (i=0; i<draggables.length; i++) {
  //   draggablesCoordsObj.set(draggables[i], {x:[], y:[], plotXs: undefined, plotYs: undefined})
  // }
})

//opposition check box
oppositionInput.addEventListener("click", (event) => {

  if (!oppositionInput.checked) {
    for (i=0;i<11;i++) {
      rightPlayers[i].remove();;
    }

  } else {
    for (i=0;i<11;i++) {
      document.querySelector("div.pitch").append(rightPlayers[i]);
    }    
  }

})

// jdP check box 
jdpInput.addEventListener("click", () => {
  if (jdpInput.checked) {
    juegoDePosicion()
  }
  else if (!jdpInput.checked) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawPitch()

  }
})


//players and ball event listeners
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add("dragging")
  })

  draggable.addEventListener('dragend', (event) => {
    draggable.classList.remove("dragging")
    let bound = canvas.getBoundingClientRect();

    let x = event.clientX - bound.left - canvas.clientLeft;
    let y = event.clientY - bound.top - canvas.clientTop; 

    if ((x<=canvas.width) && (x>=0) && (y<=canvas.height) && (y>=0)) {
      draggable.style.left = x+"px";
      draggable.style.top = y+"px";
    } 
  })

  draggable.addEventListener('drag', (event) => {

    if (startStopButton.classList.contains("stop")) {
      let bound = canvas.getBoundingClientRect();

      let x = event.clientX - bound.left - canvas.clientLeft;
      let y = event.clientY - bound.top - canvas.clientTop;    
      
      draggablesCoordsObj.get(draggable)["x"].push(x)
      draggablesCoordsObj.get(draggable)["y"].push(y)

      ctx.beginPath();
      if (draggable.classList.contains("left")) {
        var color = "dodgerblue"
      } else if (draggable.classList.contains("right")){
        var color = "purple"
      } else {
        var color = "black"
      }
      ctx.strokeStyle = color;
      ctx.arc(x, y, 1, 0, 2*Math.PI, true);
      ctx.stroke();
      ctx.closePath();
    }
  })
})

playBackButton.addEventListener('click', createAnimation)

async function createAnimation() {

  //clear canvas and redraw pitch (to remove the trails)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPitch()
  // only loop over draggables that have changed
  animatedDraggables = draggables.filter(el => draggablesCoordsObj.get(el)["x"].length > 0)
  for (i=0; i<animatedDraggables.length; i++) {
    var draggable = animatedDraggables[i]
    var draggableXs = draggablesCoordsObj.get(draggable)["x"]
    var draggableYs = draggablesCoordsObj.get(draggable)["y"]

    if (N<draggableXs.length) {
      var indices = linspace(0, draggableXs.length - 1, N).map(idx => Math.round(idx))
      console.log("n less than draggables", indices)
      plotXs = indices.map(idx => draggableXs[idx]) //of length N   
    } else {
      console.log("n not less than")
      plotXs = linspace(draggableXs[0], draggableXs[draggableXs.length-2], N)
    }

    if (N<draggableYs.length) {
      var indices = linspace(0, draggableXs.length - 1, N).map(idx => Math.round(idx))
      plotYs = indices.map(idx => draggableYs[idx]) //of length N   
    } else {
      plotYs = linspace(draggableYs[0], draggableYs[draggableYs.length-2], N)
    }
    console.log(plotXs)
    console.log(plotYs)
    draggablesCoordsObj.get(draggable)["plotXs"] = plotXs
    draggablesCoordsObj.get(draggable)["plotYs"] = plotYs
}

    for (j=0; j<N-1; j++) {
      await sleep(delayValue);
      animatedDraggables.forEach(draggable => {
        draggable.style.left = draggablesCoordsObj.get(draggable)["plotXs"][j]+"px"
        draggable.style.top = draggablesCoordsObj.get(draggable)["plotYs"][j]+"px"
      })
    }
  
}

// save video helper and event listener

// helper functions sleep and linspace
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function linspace(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    // arr.push(startValue + (step * i));
    arr.push(parseFloat((startValue + (step * i)).toFixed(2)));
  }
  return arr;
}

drawPitch();
addPlayersAndBall();