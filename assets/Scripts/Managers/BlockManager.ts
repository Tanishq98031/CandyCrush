import { _decorator, Component, Node, Prefab } from 'cc';
import { Column } from '../Candies/Column';
const { ccclass, property } = _decorator;

export var Instance = null;

@ccclass('BlockManager')
export class BlockManager extends Component {

    @property(Prefab)
    public candyPrefabs: Prefab[] = [];

    @property(Node)
    public candyBlockNodes: Node[] = [];

    public candyColumns: Column[] = [];

    onLoad()
    {
        Instance = this;
    }

    onEnable()
    {
        this.candyBlockNodes.forEach(block =>{
            this.candyColumns.push(block.getComponent(Column));
        })
    }

    matchCandies()
    {

    }
}


