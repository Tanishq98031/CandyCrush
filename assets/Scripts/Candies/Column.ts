import {
  _decorator,
  Component,
  Node,
  Prefab,
  CCInteger,
  Vec3,
  instantiate,
  tween,
} from "cc";
import {
  BlockManagerInstance,
  candyInitPosition,
  candySize,
  getRandomNumber,
  topMostCandyPos,
} from "../Constants/GameConstant";
const { ccclass, property } = _decorator;

@ccclass("Column")
export class Column extends Component {
  @property(CCInteger)
  public columnIndex: number = 0;

  start() {

  }

  onEnable()
  {
    this.generateCandies(10);
  }

  generateCandies(size: number) {
    for (var i = 0; i < size; i++) {
      var candyIndex: number = getRandomNumber(0, 5);
      var candyPrefab: Prefab = BlockManagerInstance.candyPrefabs[candyIndex];

      var candyNode: Node = instantiate(candyPrefab);
      candyNode.setParent(this.node);
      candyNode.setPosition(candyInitPosition);
      candyNode.setSiblingIndex(i);
    }

    this.fallCandiesDown();
  }

  fallCandiesDown() {
    var size = 10;
    var countDelay = 0;
    for (var i = size-1; i >= 0; i--) {

      var targetNode: Node = this.node.children[i];
      var currentYPos: number = targetNode.position.y;

      var yPos: number = topMostCandyPos - (i * candySize);

      if(yPos == currentYPos) continue;

      var targetPosition: Vec3 = new Vec3(0, yPos, 0);

      var bounceHeight = targetPosition.y + 50;
      var bounceTargetPosition: Vec3 = new Vec3(0, bounceHeight, 0);


      var moveDuration: number = 0.4;

      var delay = countDelay * 0.1;

      tween(targetNode)
        .delay(delay)
        .to(moveDuration, { position: targetPosition }, { easing: "backOut" })
        .start();

      countDelay += 1;
    }
  }

  destroyCandies(toDestroyIndexes: number[])
  {
    var shakeDuration: number = 0.25;
    var shakeAmount: number = 10;
    
    for(var i = 0; i < toDestroyIndexes.length; i++)
    {
      if(toDestroyIndexes[i] == 2)
      {
        var targetNode = this.node.children[i];
        tween(targetNode)
            .to(0.1, { position: new Vec3(targetNode.position.x - shakeAmount, targetNode.position.y, targetNode.position.z) })
            .to(0.1, { position: new Vec3(targetNode.position.x + shakeAmount, targetNode.position.y, targetNode.position.z) })
            .to(0.1, { position: new Vec3(targetNode.position.x - shakeAmount, targetNode.position.y, targetNode.position.z) })
            .to(0.1, { position: new Vec3(targetNode.position.x + shakeAmount, targetNode.position.y, targetNode.position.z) })
            .to(0.1, { position: new Vec3(targetNode.position.x - shakeAmount, targetNode.position.y, targetNode.position.z) })
            .to(0.1, { position: new Vec3(targetNode.position.x + shakeAmount, targetNode.position.y, targetNode.position.z) })
            .to(0.1, { position: targetNode.position })
            .destroySelf()
            .start();
      }
    }
  }
}
