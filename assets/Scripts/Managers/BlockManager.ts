import { _decorator, Component, Node, Prefab, tween, Vec3 } from "cc";
import { Candy } from "../Candies/Candy";
import { Column } from "../Candies/Column";
import { CandiesEnum, candySize, getTransposeMatrix, topMostCandyPos } from "../Constants/GameConstant";
const { ccclass, property } = _decorator;

export var Instance = null;

interface SwipeInfo{
    firstSwipeCandyIndex: number;
    firstSwipeColumnIndex: number;
    firstSwipeNode: Node;
    secondSwipeCandyIndex: number;
    secondSwipeColumnIndex: number;
    secondSwipeNode: Node;
    swipeDirection: string;
}

@ccclass("BlockManager")
export class BlockManager extends Component {
  @property(Prefab)
  public candyPrefabs: Prefab[] = [];

  @property(Node)
  public candyBlockNodes: Node[] = [];

  @property(Node)
  public blockInputNode: Node = null;

  public candyColumns: Column[] = [];

  private matchedColumnsList: number[][] = [];

  private currentSwipeInfo: SwipeInfo;

  onLoad() {
    Instance = this;
  }

  onEnable() {
    this.toggleInput(false);

    this.candyBlockNodes.forEach((block) => {
      this.candyColumns.push(block.getComponent(Column));
    });

    this.scheduleOnce(() => {
      this.matchCandies();
    }, 2);
  }

  matchCandies() {
    this.matchedColumnsList = Array.from({ length: 10 }, () =>
      Array(10).fill(-1)
    );

    this.matchBoth();
  }

  matchBoth() {

    var conversionArray: number[][] = Array.from({ length: 10 }, () =>
    Array(10).fill(-1));

    for(var i = 0; i < this.candyColumns.length; i++)
    {
        for(var j = 0; j < this.candyColumns[i].node.children.length; j++)
        {
            conversionArray[i][j] = this.candyColumns[i].node.children[j].getComponent(Candy).candyType;
        }
    }

    var grid: number[][] = getTransposeMatrix(conversionArray);

    const rows = grid.length;
    const cols = grid[0].length;

    // Initialize the match grid to -1
    const matchGrid: number[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(-1)
    );

    // Check for horizontal matches
    for (let row = 0; row < rows; row++) {
      let matchStart = 0;
      for (let col = 0; col < cols; col++) {
        if (col === cols - 1 || grid[row][col] !== grid[row][col + 1]) {
          // Check if there was a horizontal match of 3 or more
          if (col - matchStart + 1 >= 3) {
            for (let i = matchStart; i <= col; i++) {
              matchGrid[row][i] = 1;
            }
          }
          matchStart = col + 1;
        }
      }
    }

    // Check for vertical matches
    for (let col = 0; col < cols; col++) {
      let matchStart = 0;
      for (let row = 0; row < rows; row++) {
        if (row === rows - 1 || grid[row][col] !== grid[row + 1][col]) {
          // Check if there was a vertical match of 3 or more
          if (row - matchStart + 1 >= 3) {
            for (let i = matchStart; i <= row; i++) {
              matchGrid[i][col] = 1;
            }
          }
          matchStart = row + 1;
        }
      }
    }

    var transposedMatchGrid: number[][] = getTransposeMatrix(matchGrid);

    var isCandyDestroyed: boolean = false;
    for (var i = 0; i < transposedMatchGrid.length; i++) {
      this.candyColumns[i].destroyCandies(transposedMatchGrid[i]);

      if (!isCandyDestroyed) {
        for (var j = 0; j < transposedMatchGrid[i].length; j++) {
          if (transposedMatchGrid[i][j] == 1) {
            isCandyDestroyed = true;
            break;
          }
        }
      }
    }

    if (isCandyDestroyed) {
      this.currentSwipeInfo = null;
      this.scheduleOnce(() => {
        this.matchBoth();
      }, 2);
    }
    else 
    {
        if(this.currentSwipeInfo != null)
        {
          this.scheduleOnce(()=>{
            var currentSwipeDirection: string = this.currentSwipeInfo.swipeDirection;
            this.onSwiped(this.currentSwipeInfo.firstSwipeColumnIndex, this.currentSwipeInfo.firstSwipeCandyIndex, currentSwipeDirection, false)
          }, 0.2)
        }
        this.scheduleOnce(()=>{
          this.toggleInput(true);
        }, 0.4)
    }
  }

  onSwiped(columnIndex: number, candyIndex: number, swipeDirection: string, checkForCandyMatch: boolean = true)
  {
    this.toggleInput(false);
    var firstSwipeNode: Node = this.candyColumns[columnIndex].node.children[candyIndex];
    var secondSwipeColumnIndex: number;
    var secondSwipeCandyIndex: number;

    switch(swipeDirection)
    {
        case 'up': 
            secondSwipeColumnIndex = columnIndex; 
            secondSwipeCandyIndex = candyIndex - 1;
            break;
        case 'down': 
            secondSwipeColumnIndex = columnIndex; 
            secondSwipeCandyIndex = candyIndex + 1;
            break;
        case 'left': 
            secondSwipeColumnIndex = columnIndex - 1; 
            secondSwipeCandyIndex = candyIndex; 
            break;
        case 'right': 
            secondSwipeColumnIndex = columnIndex + 1; 
            secondSwipeCandyIndex = candyIndex;
            break;
        default:
            return;
    }

    if(secondSwipeCandyIndex < 0 || secondSwipeCandyIndex >= 10 || secondSwipeColumnIndex < 0 || secondSwipeColumnIndex >= 10) return;

    console.log("secondSwipe column: " + secondSwipeColumnIndex + ", candy: " + secondSwipeCandyIndex);

    var secondSwipeNode = this.candyColumns[secondSwipeColumnIndex].node.children[secondSwipeCandyIndex];

    this.currentSwipeInfo = {
        firstSwipeCandyIndex: candyIndex,
        firstSwipeColumnIndex: columnIndex,
        firstSwipeNode: firstSwipeNode,
        secondSwipeCandyIndex: secondSwipeCandyIndex,
        secondSwipeColumnIndex: secondSwipeColumnIndex,
        secondSwipeNode: secondSwipeNode,
        swipeDirection: swipeDirection,
    }

    var firstSwipeNodeWorldPosition: Vec3 = firstSwipeNode.worldPosition.clone();
    var secondSwipeNodeWorldPosition: Vec3 = secondSwipeNode.worldPosition.clone();

    firstSwipeNode.setParent(null);
    firstSwipeNode.setParent(this.candyColumns[secondSwipeColumnIndex].node);
    firstSwipeNode.setSiblingIndex(secondSwipeCandyIndex);
    firstSwipeNode.setWorldPosition(firstSwipeNodeWorldPosition);
    var firstSwipeNodePosition: Vec3 = new Vec3(0, topMostCandyPos - (candySize * secondSwipeCandyIndex), 0);

    secondSwipeNode.setParent(null);
    secondSwipeNode.setParent(this.candyColumns[columnIndex].node);
    secondSwipeNode.setSiblingIndex(candyIndex);
    secondSwipeNode.setWorldPosition(secondSwipeNodeWorldPosition);
    var secondSwipeNodePosition: Vec3 = new Vec3(0, topMostCandyPos - (candySize * candyIndex), 0);

    this.moveNodeToTargetPosition(firstSwipeNode, 0.2, firstSwipeNodePosition);
    this.moveNodeToTargetPosition(secondSwipeNode, 0.2, secondSwipeNodePosition);

    this.scheduleOnce(()=>{
      if(checkForCandyMatch) this.matchBoth();
    }, 0.3)
  }

  moveNodeToTargetWorldPosition(targetNode: Node, duration: number, targetWorldPosition: Vec3)
  {
    tween(targetNode)
        .to(duration, { worldPosition: targetWorldPosition })
        .start();
  }

  moveNodeToTargetPosition(targetNode: Node, duration: number, targetPosition: Vec3)
  {
    tween(targetNode)
        .to(duration, { position: targetPosition })
        .start();
  }

  toggleInput(flag: boolean)
  {
    this.blockInputNode.active = !flag;
  }
}
