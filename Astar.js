//set public data
const mapSize = 30;
const mapHeight = mapSize*20;
const mapWidth = mapSize*20;
var boxDate = [];
var openList=[];
var closeList =[];
var roundList = [];
    roundList[0]=0;
var path =[];
var currentNode;
var startNode;
var endNode;
var startBlock = false;
var endBlock = false;
var ini =false;
var funMove;


// set selector
var mapStrapper = document.querySelector('.mapStrapper');
const btnSetStart = document.querySelector('.setStart');
const btnSeEnd = document.querySelector('.setEnd');
const btnSetBarrier = document.querySelector('.setBarrierByRandom');
const btnFindRoad = document.querySelector('.findRoad');
mapStrapper.style.width =mapWidth+'px';
mapStrapper.style.mapHeight = mapHeight+'px';
console.log(mapWidth);
console.log(mapHeight);


//set class
class Color{
    constructor(){
        this. divs = document.querySelectorAll('.box');
    }
}

class Box{
    constructor(i,j){
        this.intX =i;
        this.intY =j;
        this.state = 0;
        // 0:normal 
        // 1:start
        // 2:end
        // 3:obstacle
        this.index = this.intX + this.intY * mapSize;
        this.priority =0;
        this.intPath=0;
        this.intG=0;
        this.intH=0;
        this.intF=this.intG+this.intH;
    }
    refresh(state){
        this.state=state;
        switch(state){
            case 0 :
                //normal
                color.divs[this.index].style.backgroundColor = 'bisque';
                break;
            case 1 :
                //start
                color.divs[this.index].style.backgroundColor = 'green';
                break;
            case 2 :
                //end
                color.divs[this.index].style.backgroundColor = 'red';
                break;
            case 3 :
                //obstacle
                color.divs[this.index].style.backgroundColor = 'gray';
                break;
            case 4 :
                //openList
                color.divs[this.index].style.backgroundColor = 'pink';
                this.state = 0;
                break;
            case 5 :
                //currentNode
                color.divs[this.index].style.backgroundColor = 'yellow';
                this.state = 0;
                break;
            case 6 :
                //path
                color.divs[this.index].style.backgroundColor = 'blue';
                this.state = 0;
                break;
        }
    }
}

class Astar{
    ini(){
        for (let i = 0; i < boxDate.length; i++) {
            switch(boxDate[i].state){
                //case 0
                case 1 : 
                    // path.unshift(boxDate[i]);
                    startNode =i;
                    currentNode = startNode;
                    break;
                case 2 :
                     endNode = i;
                    break;
                case 3 : 
                    // closeList.push(boxDate[i]);
                    break;
                // case 4 :
            } 
        }
        console.log(closeList);
    }
    round(currentBox){
        let x = currentBox.intX;
        let y = currentBox.intY;
        for (let i = 1; i < 10; i++) {
            let returnX =x;
            let returnY =y;
            switch(i){
                case 1:
                returnX -= 1;
                returnY -= 1;
                break;
                case 2:
                returnY -= 1;
                break;
                case 3:
                returnX += 1;
                returnY -= 1;
                break;
                case 4:
                returnX -= 1;
                break;
                case 5:
                break;
                case 6:
                returnX += 1;
                break;
                case 7:
                returnX -= 1;
                returnY += 1;
                break;
                case 8:
                returnY += 1;
                break;
                case 9:
                returnX += 1;
                returnY += 1;
                break;
            }
             //check the box belong map
            if(returnX >=0 &&returnY>=0 &&returnX<mapSize &&returnY<mapSize && i!=5){
                let returnIndex = returnX+returnY*mapSize;
                //check the box round for set openlist and closeList
                 if(boxDate[returnIndex].state==2){
                    clearInterval(funMove);
                    console.log('need to do a function for endEvent');
                 }else if (boxDate[returnIndex].state==3){
                    closeList.push(boxDate[returnIndex]);
                 }else if (boxDate[returnIndex].state==0){
                    openList.push(boxDate[returnIndex]);
                    boxDate[returnIndex].refresh(4);
                 }
            }    
        }
    }
    checkMinF(){
        this.calF(openList[0],boxDate[currentNode],boxDate[endNode]);
        let minF = openList[0].intF;
        let minID = 0;
        for (let i = 1; i < openList.length; i++) {
        this.calF(openList[i],boxDate[currentNode],boxDate[endNode]);
        if(openList[i].intF<minF){
            minF = openList[i].intF;
            minID = i;
        }     
        }
        //remove bug about having two yellow block on map and need to consider the circumstance that box[endNode] maybe no display;
        boxDate[currentNode].refresh(4);
        boxDate[startNode].refresh(1);
        //
        currentNode =  openList[minID].index ;
        openList.splice(minID,1);
        closeList.push(boxDate[currentNode]);
        boxDate[currentNode].refresh(5);
    }
    calF(openBox,curBox,endBox){
        this.calG(openBox,curBox);
        this.calH(openBox,endBox);
        openBox.intF = openBox.intG+openBox.intH;
        console.log(openBox);
    }
    calG(openBox,curBox){
        let rltX = Math.pow(((openBox.intX - curBox.intX)*10),2);
        let rltY =Math.pow(((openBox.intY - curBox.intY)*10),2);
        let result =Math.floor(Math.sqrt(rltX+rltY));
        openBox.intG += result;     
    }
    calH(openBox,endBox){
        let rltX = Math.abs((openBox.intX - endBox.intX)*10);
        let rltY = Math.abs((openBox.intY - endBox.intY)*10);
        openBox.intH= rltX+rltY;
    };
}


//function
function ADrandom(Max,Min){
    return Math.floor(Math.random()*(Max-Min)-Min);
}
function setStartEvent(){
    if(startBlock==false ){
        let x = ADrandom(mapSize-1,0);
        let y = ADrandom(mapSize-1,0);
        if(boxDate[x+y*mapSize].state==0){
            boxDate[x+y*mapSize].refresh(1);
            startNode=x+y*mapSize;
            currentNode=startNode;
            startBlock =true;
        }else{
                setStartEvent();
            }
        }
    else{
        console.log('done!');
    } 
}
function setEndEvent(){
    if(endBlock==false ){
        let x = ADrandom(mapSize-1,0);
        let y = ADrandom(mapSize-1,0);
        if(boxDate[x+y*mapSize].state==0){
            boxDate[x+y*mapSize].refresh(2);
            endBlock =true;
            endNode = x+y*mapSize
        }else{
            setEndEvent();
        }
    }
    else{
        console.log('done!');
    }
}
function setObstacleEvent(){
for (let i = 0; i < mapSize; i++) {
        let x = ADrandom(mapSize-1,0);
        let y = ADrandom(mapSize-1,0); 
        if(boxDate[x+y*mapSize].state==0){
            boxDate[x+y*mapSize].refresh(3);
        }else{
            continue;
        }   
}
}
function drawMap(m){
    //define the map size 
    // mapStrapper.style.width =mapWidth;
    // mapStrapper.style.height =mapHeight;
    // create blocks 
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
            const div = document.createElement('div');
            div.id = j+','+i;
            div.className='box';    
            mapStrapper.appendChild(div);
            boxDate.push(new Box(j,i));        
        }   
    }
}
function move(){
    funMove =  setInterval(() => {
        timer();
    },500);
}
function timer(){
    astar.round(boxDate[currentNode]); 
    astar.checkMinF();
}


//main
drawMap(mapSize);
console.log(boxDate);

//create new class
var color =  new Color();
var astar = new Astar();

//set btnEvent
btnSetStart.addEventListener('click',() => {
    setStartEvent();
    }
    );
btnSeEnd.addEventListener('click',() => {
    setEndEvent();
    }
    );
btnSetBarrier.addEventListener('click',() => {
    setObstacleEvent();
    });
btnFindRoad.addEventListener('click',() => {
        if(ini ==false){
            astar.ini();
            ini = true;
            console.log('ini done!');
        } else{
         move();
}});
