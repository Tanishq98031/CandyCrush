import { _decorator, Component, Node, Enum, Vec2, EventTouch } from 'cc';
import { BlockManagerInstance, CandiesEnum } from '../Constants/GameConstant';
import { Column } from './Column';
const { ccclass, property } = _decorator;

@ccclass('Candy')
export class Candy extends Component {

    @property({ type: Enum(CandiesEnum) })
    public candyType: CandiesEnum = CandiesEnum.BLUECANDY;

    private startTouchPosition: Vec2 = null;
    private endTouchPosition: Vec2 = null;

    onEnable()
    {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(event: EventTouch) {
        console.log("TouchStart")
        this.startTouchPosition = event.getLocation();
    }
    
    private onTouchMove(event: EventTouch) {
        this.endTouchPosition = event.getLocation();
    }
    
    private onTouchEnd(event: EventTouch) {

    }
    
    private onTouchCancel(event: EventTouch) {
        if (!this.startTouchPosition || !this.endTouchPosition) return;
    
        // Calculate swipe direction
        const direction = this.getSwipeDirection(this.startTouchPosition, this.endTouchPosition);
    
        if (direction) {
            // this.swapCandies(direction);
            console.log("direction: ",direction);
            BlockManagerInstance.onSwiped(this.node.parent.getComponent(Column).columnIndex, this.node.getSiblingIndex(), direction);
        }
    
        // Reset positions
        this.startTouchPosition = null;
        this.endTouchPosition = null;
    }

    private getSwipeDirection(start: Vec2, end: Vec2): string | null {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
    
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return deltaY > 0 ? 'up' : 'down';
        }
        return null; // No significant swipe
    }
}


