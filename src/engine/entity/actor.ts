import { Obj } from './object'
import { Environment } from '../environment'
import { IEntity } from '../../base/entity'


export interface ISpeed {
    x: number
    y: number
}

interface IActor extends IEntity {
    speed: ISpeed
}

export class Actor extends Obj implements IEntity {
    speed: ISpeed
    constructor(config: IActor, env: Environment) {
        super(config, env)
        this.type = 'actor'
        this.speed = config.speed
    }
}
