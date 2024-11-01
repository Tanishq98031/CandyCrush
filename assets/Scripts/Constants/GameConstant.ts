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

export enum CandiesEnum
{
    BLUECANDY = 0,
    GREENCANDY = 1,
    ORANGECANDY = 2,
    PURPLECANDY = 3, 
    REDCANDY = 4,
    YELLOWCANDY = 5,
}

export function getTransposeMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposed: number[][] = [];

    for (let i = 0; i < cols; i++) {
        transposed[i] = [];
        for (let j = 0; j < rows; j++) {
            transposed[i][j] = matrix[j][i];
        }
    }

    return transposed;
}

