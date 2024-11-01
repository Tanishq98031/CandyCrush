import { _decorator, Component, Node, Enum } from 'cc';
import { CandiesEnum } from '../Constants/GameConstant';
const { ccclass, property } = _decorator;

@ccclass('Candy')
export class Candy extends Component {

    @property({ type: Enum(CandiesEnum) })
    public candyType: CandiesEnum = CandiesEnum.BLUECANDY;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


