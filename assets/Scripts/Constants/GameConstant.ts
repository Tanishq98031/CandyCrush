import { _decorator, Component, Node, Vec3 } from 'cc';
import { BlockManager, Instance } from '../Managers/BlockManager';
const { ccclass, property } = _decorator;

@ccclass('GameConstant')
export class GameConstant{

}

export function getRandomNumber(min: number, max: number): number {
    // Ensure min and max are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export var topMostCandyPos: number = 450;
export var candySize: number = 100;
export var candyInitPosition: Vec3 = new Vec3(0, 800, 0);

export { Instance as BlockManagerInstance } from '../Managers/BlockManager';

export const enum CandiesEnum
{
    BLUECANDY = 0,
    GREENCANDY = 1,
    ORANGECANDY = 2,
    PURPLECANDY = 3, 
    REDCANDY = 4,
    YELLOWCANDY = 5,
}

