import { _decorator, Component, Node, Prefab } from 'cc';
import { Candy } from '../Candies/Candy';
import { Column } from '../Candies/Column';
import { CandiesEnum } from '../Constants/GameConstant';
const { ccclass, property } = _decorator;

export var Instance = null;

@ccclass('BlockManager')
export class BlockManager extends Component {

    @property(Prefab)
    public candyPrefabs: Prefab[] = [];

    @property(Node)
    public candyBlockNodes: Node[] = [];

    public candyColumns: Column[] = [];

    private matchedColumnsList: number[][] = [];

    onLoad()
    {
        Instance = this;
    }

    onEnable()
    {
        this.candyBlockNodes.forEach(block =>{
            this.candyColumns.push(block.getComponent(Column));
        })

        this.scheduleOnce(()=>{
            this.matchCandies();
            this.destroyCandies();
        }, 2);
    }

    matchCandies()
    {
        this.matchedColumnsList = Array.from({ length: 10 }, () => Array(10).fill(-1));

        this.matchColumns();
        this.matchRows();
        console.log("matchedColumns: ", this.matchedColumnsList);
    }

    matchColumns()
    {
        this.candyColumns.forEach((column, index) => {

            var currentCandy = CandiesEnum.BLUECANDY;
            var matchedColumn: number[] = Array(10).fill(-1);
            currentCandy = column.node.children[0].getComponent(Candy).candyType;
            var count = 1;
            matchedColumn[0] = 1;

            for(var i = 1; i < column.node.children.length; i++)
            {
                var newCandy = column.node.children[i].getComponent(Candy).candyType;
                if(currentCandy == newCandy)
                {
                    matchedColumn[i] = 1;
                    count += 1;
                }
                else 
                {
                    currentCandy = newCandy;
                    for(var j = 0; j < 10; j++)
                    {
                        if(matchedColumn[j] == 1)
                        {
                            matchedColumn[j] = count >= 3 ? 2 : -1;
                        }
                    }

                    if(matchedColumn[i] == -1) matchedColumn[i] = 1;
                    count = 1;
                }
            }

            this.matchedColumnsList[index] = matchedColumn;
        })
    }

    matchRows()
    {
        for(var row = 0; row < 10; row++)
        {
            var currentCandy = this.candyColumns[0].node.children[row].getComponent(Candy).candyType;
            var matchedColumn: number[] = Array(10).fill(-1);
            var count = 1;
            matchedColumn[0] = 1;

            for(var i = 1; i < 10; i++)
            {
                var newCandy = this.candyColumns[i].node.children[row].getComponent(Candy).candyType;
                if(currentCandy == newCandy)
                {
                    matchedColumn[i] = 1;
                    count += 1;
                }
                else 
                {
                    currentCandy = newCandy;
                    for(var j = 0; j < 10; j++)
                    {
                        if(matchedColumn[j] == 1)
                        {
                            matchedColumn[j] = count >= 3 ? 2 : -1;
                        }
                    }

                    if(matchedColumn[i] == -1) matchedColumn[i] = 1;
                    count = 1;
                }
            }

            for(var j = 0; j < 10; j++)
            {
                if(this.matchedColumnsList[j][row] < 0 && matchedColumn[j] > 1)
                {
                    this.matchedColumnsList[j][row] = 2;
                }
            }
        }
    }

    destroyCandies()
    {
        for(var i = 0; i < this.matchedColumnsList.length; i++)
        {
            this.candyColumns[i].destroyCandies(this.matchedColumnsList[i]);
        }
    }
}


