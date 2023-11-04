import { Obj } from './object'
import { Environment } from '../environment'
import { IEntity } from '../../base/entity'

export class Actor extends Obj implements IEntity {
    constructor(config: IEntity, env: Environment) {
        super(config, env)
        this.type = 'actor'
    }
}
