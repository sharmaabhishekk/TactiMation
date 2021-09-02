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

const N = delayValue
const border = 10

/*
x & y : actual drag coordinates gotten from the user while dragging
userSetX & userSetY: the new positions of the objects that the user sets before starting a scene
plotXs & plotYs: recomputed N-length xs and ys - the actual path where we'll animate the objects moving
*/
let draggablesCoordsObj = new Map();
for (i=0; i<draggables.length; i++) {
  draggablesCoordsObj.set(draggables[i], {x:[], y:[], plotXs: [], plotYs: [], userSetX: 0, userSetY: 0})
} 



function drawPitch() {
    
  // Outer lines
  ctx.beginPath();
  ctx.rect(0,0, canvas.width, canvas.height); // entire pitch + 10 unit border
  ctx.fillStyle = "#53c653";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#FFF";
  ctx.rect(border, border, canvas.width - 2*border, canvas.height - 2*border) // pitch outline
  ctx.stroke();
  ctx.closePath();
  
  ctx.fillStyle = "#FFF";
  
  // Mid line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, border);
  ctx.lineTo(canvas.width / 2, canvas.height - border);
  ctx.stroke();
  ctx.closePath();
  
  //Mid circle
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, 2*(Math.PI), false);
  ctx.stroke();
  ctx.closePath();
  //Mid point
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2*Math.PI, false);
  ctx.fill();
  ctx.closePath();
  
  //Home penalty box
  ctx.beginPath();
  ctx.rect(border, (canvas.height - 322) / 2, 132, 322); //w: 132, h: 322
  ctx.stroke();
  ctx.closePath();
  //Home goal box
  ctx.beginPath();
  ctx.rect(border, (canvas.height - 146) / 2, 44, 146); //w: 44, h: 146
  ctx.stroke();
  ctx.closePath();
  //Home goal 
  ctx.beginPath();
  ctx.moveTo(border, (canvas.height / 2) - 22);
  ctx.lineTo(border, (canvas.height / 2) + 22);
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;

  //Home penalty point
  ctx.beginPath()
  ctx.arc(98, canvas.height / 2, 1, 0, 2*Math.PI, true);
  ctx.fill();
  ctx.closePath();
  //Home half circle
  ctx.beginPath()
  ctx.arc(98, canvas.height / 2, 73, 0.29*Math.PI, 1.71*Math.PI, true);
  ctx.stroke();
  ctx.closePath();
  
  //Away penalty box
  ctx.beginPath();
  ctx.rect(canvas.width-142, (canvas.height - 322) / 2, 132, 322);
  ctx.stroke();
  ctx.closePath();
  //Away goal box
  ctx.beginPath();
  ctx.rect(canvas.width-54, (canvas.height - 146) / 2, 44, 146);
  ctx.stroke();
  ctx.closePath();      
  //Away goal 
  ctx.beginPath();
  ctx.moveTo(canvas.width-border, (canvas.height / 2) - 22);
  ctx.lineTo(canvas.width-border, (canvas.height / 2) + 22);
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;
  //Away penalty point
  ctx.beginPath()
  ctx.arc(canvas.width-98, canvas.height / 2, 1, 0, 2*Math.PI, true);
  ctx.fill();
  ctx.closePath();
  //Away half circle
  ctx.beginPath()
  ctx.arc(canvas.width-98, canvas.height / 2, 73, 0.71*Math.PI, 1.29*Math.PI, false);
  ctx.stroke();
  ctx.closePath();
        
  //Home L corner
  ctx.beginPath()
  ctx.arc(border, border, 8, 0, 0.5*Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  //Home R corner
  ctx.beginPath()
  ctx.arc(border, canvas.height-border, 8, 0, 1.5*Math.PI, true);
  ctx.stroke();
  ctx.closePath();
  //Away R corner
  ctx.beginPath()
  ctx.arc(canvas.width-border, border, 8, 0.5*Math.PI, 1*Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  //Away L corner
  ctx.beginPath()
  ctx.arc(canvas.width-border, canvas.height-border, 8, 1*Math.PI, 1.5*Math.PI, false);
  ctx.stroke();
  ctx.closePath();

  ctx.font = "30px Poppins";
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.textAlign = "center";
  ctx.fillText("TactiMation", 700, 500);
}

function addPlayersAndBall() {
  // 4-3-3: gk lb lcb rcb rb lmf cmf rmf lw st rw
  leftXs = [150, 444, 415, 430, 528, 556, 486, 532, 627, 640, 597];
  leftYs = [259, 172, 297, 434, 480, 166, 259, 346, 126, 248, 398];
  // 4-4-2: gk rb rcb lcb lb rw rmf lmf lw lf rf
  rightXs = [723, 654, 659, 659, 660, 606, 613, 613, 598, 531, 521];
  rightYs = [259, 142, 210, 284, 358, 144, 202, 284, 338, 202, 316];

  ballX = 454;
  ballY = 181;

  for (i=0; i<leftXs.length; i++) {
    leftPlayers[i].style.top = leftYs[i]+"px";
    leftPlayers[i].style.left = leftXs[i]+"px";
    draggablesCoordsObj.get(leftPlayers[i])["userSetY"] = leftYs[i]
    draggablesCoordsObj.get(leftPlayers[i])["userSetX"] = leftXs[i]

  }  

  for (i=0; i<rightXs.length; i++) {
    rightPlayers[i].style.top = rightYs[i]+"px";
    rightPlayers[i].style.left = rightXs[i]+"px";
    draggablesCoordsObj.get(rightPlayers[i])["userSetY"] = rightYs[i]
    draggablesCoordsObj.get(rightPlayers[i])["userSetX"] = rightXs[i] 
  }

  //ball 
  ball.style.top = ballY+"px";
  ball.style.left = ballX+"px";
  draggablesCoordsObj.get(ball)["userSetY"] = ballY
  draggablesCoordsObj.get(ball)["userSetX"] = ballX
}

function juegoDePosicion() {
  ctx.fillStyle = "#FFF";
  ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
  
  // h1
  ctx.beginPath();
  ctx.moveTo(142, (canvas.height - 322) / 2);
  ctx.lineTo(canvas.width - 142, (canvas.height - 322) / 2);
  ctx.stroke();
  ctx.closePath();

  // h2
  ctx.beginPath();
  ctx.moveTo(142, (canvas.height - 146) / 2);
  ctx.lineTo(canvas.width - 142, (canvas.height - 146) / 2);
  ctx.stroke();
  ctx.closePath();

  // h3
  ctx.beginPath();
  ctx.moveTo(142, 332);
  ctx.lineTo(canvas.width - 142, 332);
  ctx.stroke();
  ctx.closePath(); 

  // h4
  ctx.beginPath();
  ctx.moveTo(142, canvas.height-98);
  ctx.lineTo(canvas.width - 142, canvas.height-98);
  ctx.stroke();
  ctx.closePath();

  // v1
  ctx.beginPath();
  ctx.moveTo(142, canvas.height - 10);
  ctx.lineTo(142, canvas.height - 98);
  ctx.stroke();
  ctx.closePath();  

  // v2
  ctx.beginPath();
  ctx.moveTo(142, 10);
  ctx.lineTo(142, 98);
  ctx.stroke();
  ctx.closePath();  

  // v3
  ctx.beginPath();
  ctx.moveTo(canvas.width - 142, 10);
  ctx.lineTo(canvas.width - 142, 98);
  ctx.stroke();
  ctx.closePath();  

  // v4
  ctx.beginPath();
  ctx.moveTo(canvas.width - 142, canvas.height - 10);
  ctx.lineTo(canvas.width - 142, canvas.height - 98);
  ctx.stroke();
  ctx.closePath();  

  // v5
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 132, 10);
  ctx.lineTo(canvas.width/2 - 132, 98);
  ctx.stroke();
  ctx.closePath(); 

  // v6
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 132, canvas.height - 10);
  ctx.lineTo(canvas.width/2 - 132, canvas.height - 98);
  ctx.stroke();
  ctx.closePath(); 

  // v7
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 + 132, 10);
  ctx.lineTo(canvas.width/2 + 132, 98);
  ctx.stroke();
  ctx.closePath(); 

  // v8
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 + 132, canvas.height - 10);
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
})

//opposition check box
oppositionInput.addEventListener("click", (event) => {

  if (!oppositionInput.checked) {
    for (i=0;i<11;i++) {
      rightPlayers[i].remove();
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

    let x = event.clientX - bound.left - canvas.clientLeft - 5;
    let y = event.clientY - bound.top - canvas.clientTop - 5; 

    if ((x<=canvas.width) && (x>=0) && (y<=canvas.height) && (y>=0)) {
      draggable.style.left = x+"px";
      draggable.style.top = y+"px";
      draggablesCoordsObj.get(draggable)["userSetX"] = x
      draggablesCoordsObj.get(draggable)["userSetY"] = y

    } 
  })

  draggable.addEventListener('drag', (event) => {

    if (startStopButton.classList.contains("stop")) {
      let bound = canvas.getBoundingClientRect();

      let x = event.clientX - bound.left - canvas.clientLeft - 5;
      let y = event.clientY - bound.top - canvas.clientTop - 5;    
      
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
  animatedDraggables = draggables.filter(el => draggablesCoordsObj.get(el)["x"].length > 0) // fire, if there's an animation
  if (animatedDraggables.length > 0) {
      //clear canvas and redraw pitch (to remove the trails)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawPitch()
    if (jdpInput.checked) {
      juegoDePosicion()
    }
    // only loop over draggables that have changed
    animatedDraggables = draggables.filter(el => draggablesCoordsObj.get(el)["x"].length > 0)
    for (i=0; i<animatedDraggables.length; i++) {
      var draggable = animatedDraggables[i]
      var draggableXs = draggablesCoordsObj.get(draggable)["x"]
      var draggableYs = draggablesCoordsObj.get(draggable)["y"]

      if (N<draggableXs.length) {
        var indices = linspace(0, draggableXs.length - 1, N).map(idx => Math.round(idx))
        plotXs = indices.map(idx => draggableXs[idx]) //of length N   
      } else {
        plotXs = linspace(draggableXs[0], draggableXs[draggableXs.length-2], N)
      }

      if (N<draggableYs.length) {
        var indices = linspace(0, draggableXs.length - 1, N).map(idx => Math.round(idx))
        plotYs = indices.map(idx => draggableYs[idx]) //of length N   
      } else {
        plotYs = linspace(draggableYs[0], draggableYs[draggableYs.length-2], N)
      }

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
}

// save video helper and event listener
saveButton.addEventListener("click", async () => {
  animatedDraggables = draggables.filter(el => draggablesCoordsObj.get(el)["x"].length > 0) // fire, if there's an animation
  if (animatedDraggables.length>0) {
    computedDraggables = animatedDraggables.filter(el => draggablesCoordsObj.get(el)["plotXs"] > 0) // check if play has been clicked
    if (computedDraggables.length>0) {
      createAnimation()
    }
    draggables.forEach(draggable => draggable.remove())
    nonAnimatedDraggables = draggables.filter(el => draggablesCoordsObj.get(el)["x"].length == 0)
    capturer.start() 
    for (j=0; j<N-1; j++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawPitch()
      if (jdpInput.checked) {
        juegoDePosicion()
      }
  
      animatedDraggables.forEach(draggable => {
        var color = draggable.classList.contains("ball") ? "black" : (draggable.classList.contains("left") ? "dodgerblue" : "purple")
        var radius = draggable.classList.contains("ball") ? 4 : 9
        ctx.beginPath()
        ctx.save()
        ctx.arc(draggablesCoordsObj.get(draggable)["plotXs"][j]+border, 
                draggablesCoordsObj.get(draggable)["plotYs"][j]+border, 
                radius, 0, 2*Math.PI, true)
        ctx.lineWidth = 2;     
        ctx.strokeStyle = 'white'
        ctx.fillStyle = color        
        ctx.stroke();  
        ctx.fill();
        ctx.closePath();
        ctx.restore()      
      })
  
      nonAnimatedDraggables.forEach(draggable => {
        var color = draggable.classList.contains("ball") ? "black" : (draggable.classList.contains("left") ? "dodgerblue" : "purple")
        var radius = draggable.classList.contains("ball") ? 4 : 9 
        ctx.beginPath()
        ctx.save()
  
        ctx.arc(draggablesCoordsObj.get(draggable)["userSetX"]+border, 
                draggablesCoordsObj.get(draggable)["userSetY"]+border, 
                radius, 0, 2*Math.PI, true)
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white'
        ctx.fillStyle = color        
        ctx.stroke();  
        ctx.fill();
        ctx.closePath();
        ctx.restore() 
      })
      capturer.capture(canvas);
  
    }
    capturer.stop();
    capturer.save();

  }

})


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