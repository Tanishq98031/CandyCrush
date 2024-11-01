import { _decorator, Component, Node, Prefab, CCInteger, Vec3, instantiate, tween } from 'cc';
import { BlockManagerInstance, candyInitPosition, candySize, getRandomNumber, topMostCandyPos } from '../Constants/GameConstant';
const { ccclass, property } = _decorator;

@ccclass('Column')
export class Column extends Component {

    @property(CCInteger)
    public columnIndex: number = 0;

    start() {
        this.generateCandies(10);
    }

    generateCandies(size: number)
    {
        for(var i = 0; i < size; i++)
        {
            var candyIndex: number = getRandomNumber(0, 5);
            var candyPrefab: Prefab = BlockManagerInstance.candyPrefabs[candyIndex];

            var candyNode: Node = instantiate(candyPrefab);
            candyNode.setParent(this.node);
            candyNode.setPosition(candyInitPosition);
            candyNode.setSiblingIndex(i);
        }

        for(var i = size-1; i >= 0; i--){
            this.fallCandiesDown(i);
        }
    }

    fallCandiesDown(index: number)
    {
        var yPos: number = topMostCandyPos - (index * candySize);
        if(this.columnIndex == 0) console.log("yPos: ", yPos)
        var targetPosition: Vec3 = new Vec3(0, yPos, 0);

        var bounceHeight = targetPosition.y + 50;
        var bounceTargetPosition: Vec3 = new Vec3(0, bounceHeight, 0);

        var targetNode: Node = this.node.children[index];

        var moveDuration: number = 0.4;

        var delay = (9-index) * 0.1;

        tween(targetNode)
            .delay(delay)
            .to(moveDuration, {position: targetPosition}, { easing: 'backOut' })
            .start();
    }
}


