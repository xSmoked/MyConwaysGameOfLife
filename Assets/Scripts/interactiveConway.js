var ROW = 100;
var COL = 100;
var percentAlive = 15;
var randomNum = 0;
const oneRow = []
const colorRow = [];
const board = [];
const nextBoard = [];
const colorBoard = [];
const adjacentColorArray = ["#FFFFFF", "#FFFFFF" , "#FFFFFF"];
const colorBarArray = ["#8f0d1c","#FFA500","#e6df25","#57c914","#11469c","#741694","#FFFFFF","#000000"];
var intervalID;
var colorSelected = 7;
var isDarkTheme = 0;
var isErase = 0;

const canvas = document.getElementById('Canvas');
canvas.width = 1000;
canvas.height = 1000;
const cellSide = 10;
var ctx = canvas.getContext('2d');

canvas.addEventListener('click', function(event){
    //alert();
    var rect = canvas.getBoundingClientRect();
    //ensures x and y are integers
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);
    
  
    //Decrements X and Y postion to fit into cell board
    while((x % 10) < 9){
      x--;
    }
    while((y % 10) < 9){
      y--;
    }
    let j = (x+1)/10;
    let i = (y+1)/10;
  if(isErase == 0){
    board[i][j] = 'A';
    colorBoard[i][j] = colorBarArray[colorSelected]
  }
  else {
    board[i][j] = '.';
    if(isDarkTheme == 0){
      colorBoard[i][j] = "#FFFFFF";
    }
    else{
      colorBoard[i][j] = "#454241";
    }
  }
    
    ;
  
    //Print updated board
    printBoard();
  
},false);

//Function Calls for Game
setBoard();
printBoard();


document.getElementById('Erase').onclick = function() {
  isErase = 1;
}

document.getElementById('Next').onclick = function() {
  play();
}
document.getElementById('Reset').onclick = function() {
  reset();
  printBoard();
}

document.getElementById('darkTheme').onclick = function() {
  isDarkTheme = 1;
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      if(board[i][j] == '.'){
        colorBoard[i][j] = "#454241";    
      }//end if
    }//end for
  }//end for
  printBoard();
}//end function

document.getElementById('lightTheme').onclick = function() {
  isDarkTheme = 0;
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      if(board[i][j] == '.'){
        colorBoard[i][j] = "#FFFFFF";    
      }//end if
    }//end for
  }//end for
  printBoard();
}//end function



document.getElementById('Play').onclick = function() {
  intervalID = setInterval(play, 10);
}
Pause.onclick = function(){
  clearInterval(intervalID)
}

document.getElementById('Clear').onclick = function() {
  clear();
  printBoard();
}

//Color
document.getElementById('RedColor').onclick = function() {
  colorSelected = 0;
  isErase = 0;
}
document.getElementById('OrangeColor').onclick = function() {
  colorSelected = 1;
  isErase = 0;
}
document.getElementById('YellowColor').onclick = function() {
  colorSelected = 2;
  isErase = 0;
}
document.getElementById('GreenColor').onclick = function() {
  colorSelected = 3;
  isErase = 0;
}
document.getElementById('BlueColor').onclick = function() {
  colorSelected = 4;
  isErase = 0;
}
document.getElementById('PurpleColor').onclick = function() {
  colorSelected = 5;
  isErase = 0;
}
document.getElementById('WhiteColor').onclick = function() {
  colorSelected = 6;
  isErase = 0;
}
document.getElementById('BlackColor').onclick = function() {
  colorSelected = 7;
  isErase = 0;
}


function setBoard(){
  for(let i = 0; i < ROW; i++){
    randomNum = Math.floor(Math.random()*100);
    for(let j = 0; j < COL; j++){
      //console.log(randomNum);
      if(randomNum < percentAlive){
        oneRow.push('A');
        colorRow.push('#864299');
      }
      else {
        oneRow.push('.');
        colorRow.push('#454241');
      }
    }//end for
    for(let z = 0; z < oneRow.length; z += COL){
      board.push(oneRow.slice(z, z + COL));
      nextBoard.push(oneRow.slice(z, z + COL));
      colorBoard.push(colorRow.slice(z, z + COL));
      
    }//end for
  }//end for
  reset();
}//end function

function printBoard(){
    for(let i = 0; i < board.length; i++){
      for(let j = 0; j < board[i].length; j++){
        let x = j * cellSide;
        let y = i * cellSide;
        cellColor = colorBoard[i][j];
        ctx.beginPath();
        ctx.fillStyle = cellColor;
        ctx.fillRect(x,y,cellSide,cellSide);
    }
  }
}

//counts adjacent cells around current cell to see if they are alive
function countNeighbourAlive(x,y){
  var liveCount = 0;
  for(let i = x-1; i <= x+1; i++){
    //THIS FUCKING LINE COST ME 2 HOURS OF BUG FIXING fuck =<   < gang W
    for(let j = y-1; j <= y+1; j++){
      if((i == x && j == y) || (i < 0 || j < 0) || (i >= ROW || j >= COL)){
        continue;
      }
      else if(board[i][j] == 'A'){
        liveCount += 1;
      }
      
    }//end for j
  }//end for i
  return liveCount;
}//end function

function shiftCells(){
  var liveCount = 0;
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      liveCount = countNeighbourAlive(i,j);
      if(board[i][j] == 'A' && liveCount < 2){
        nextBoard[i][j] = '.';
        if(isDarkTheme == 0){
          colorBoard[i][j] = '#FFFFFF';
        }
        else {
          colorBoard[i][j] = '#454241';
        }
        
      }
      else if(board[i][j] == 'A' && liveCount > 3){
        nextBoard[i][j] = '.';
        if(isDarkTheme == 0){
          colorBoard[i][j] = '#FFFFFF';
        }
        else {
          colorBoard[i][j] = '#454241';
        }
      }
      else if(board[i][j] == '.' && liveCount == 3){
        nextBoard[i][j] = 'A';
        //colorBoard[i][j] = '#864299'; //average of adjacent 3 cells
        colorBoard[i][j] = findAdjacentAverageColor(i, j);
          
      }
      else {
        nextBoard[i][j] = board[i][j];
      }
      
    }//end for j
  }//end for i
  
  //assign board the nextGens value as to reset it for next loop
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      board[i][j] = nextBoard[i][j];
    }
  }
}//end function

function findAdjacentAverageColor(x, y){
  var liveCounter = 0;
  for(let i = x-1; i <= x+1; i++){
    for(let j = y-1; j <= y+1; j++){
      if((i == x && j == y) || (i < 0 || j < 0) || (i >= ROW || j >= COL)){
        continue;
      }
      else if(board[i][j] == 'A'){
        adjacentColorArray[liveCounter] = colorBoard[i][j];
        liveCounter++;
      }
    }//end for j
  }//end for i
  //console.table(adjacentColorArray);
  return CalcAverageHex(adjacentColorArray[0],adjacentColorArray[1],adjacentColorArray[2]);
}//end function

function CalcAverageHex(hex1,hex2,hex3){
  
  //Parsed from hex to int and split into its individual values  started at 1 to avoid #
  let hexC11 = parseInt(hex1.slice(1,3), 17);  
  let hexC12 = parseInt(hex1.slice(3,5), 17);
  let hexC13 = parseInt(hex1.slice(5,7), 17);
  let hexC21 = parseInt(hex2.slice(1,3), 17);
  let hexC22 = parseInt(hex2.slice(3,5), 17);
  let hexC23 = parseInt(hex2.slice(5,7), 17);
  let hexC31 = parseInt(hex3.slice(1,3), 17);
  let hexC32 = parseInt(hex3.slice(3,5), 17);
  let hexC33 = parseInt(hex3.slice(5,7), 17);
  
  //calculate average
  let colorMean1 = Math.floor((hexC11 + hexC21 + hexC31) / 3);
  let colorMean2 = Math.floor((hexC12 + hexC22 + hexC32) / 3);
  let colorMean3 = Math.floor((hexC13 + hexC23 + hexC33) / 3);
  
  //convert to string
  let colorMean1Hex = colorMean1.toString(16);
  let colorMean2Hex = colorMean2.toString(16);
  let colorMean3Hex = colorMean3.toString(16);
  
  //pad if hex is too short
  if (colorMean1Hex.length == 1)
  colorMean1Hex = "0" + colorMean1Hex;
  if (colorMean2Hex.length == 1)
    colorMean2Hex = "0" + colorMean2Hex;
  if (colorMean3Hex.length == 1)
    colorMean3Hex = "0" + colorMean3Hex;
  
  //merge into hex color
  let avgHexColor = '#' + colorMean1Hex + colorMean2Hex + colorMean3Hex;
  
  return avgHexColor;
}

function reset(){
  for(let i = 0; i < ROW; i++){
    for(let j = 0; j < COL; j++){
      randomNum = Math.floor((Math.random()) * 100);
      if(randomNum < percentAlive){
        board[i][j] = 'A';
        colorBoard[i][j] = '#' + Math.floor(Math.random()*16777215).toString(16);
      }
      else {
        board[i][j] = '.';
        colorBoard[i][j] = '#FFFFFF';
      }//end if
    }//end for
  }//end for
}

function play(){
  shiftCells();
  printBoard();
}

function clear(){
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      board[i][j] = '.';
      colorBoard[i][j] = "#FFFFFF";
    }
  }
}

