import { FSM } from '@/algorithm/fsm';

// ============ Creep 专用的类型别名 ============

/** 事件标识 */
export type Event = FSM.Event;

/** 状态转移目标：状态值、或根据 Creep 动态决定的状态 */
export type Transition = FSM.Transition<number, Creep>;

/** 条件判断函数 */
export type Condition = FSM.Condition<Creep>;

// ============ Creep 专用辅助函数 ============

/** 创建事件 */
export const defineEvent = FSM.defineEvent;

/** 创建转移条件 */
export const when: (condition: Condition, toState: Transition) => Transition = FSM.when;

/** 组合多个 Transition，返回第一个匹配的结果 */
export const branch: (...transitions: Transition[]) => Transition = FSM.branch;

/** 创建事件响应 */
export const on: (event: Event, toState: Transition) => [Event, Transition] = FSM.on;

/**
 * 角色行为接口
 */
export interface IRole {
    run(creep: Creep): void;
}

/**
 * 角色基类 - 基于状态机，状态存储在 creep.memory.state
 */
export abstract class RoleBase<State extends number = number> extends FSM<Creep, State> implements IRole {
    protected getState(creep: Creep): State | undefined {
        return creep.memory.state as State | undefined;
    }

    protected setState(creep: Creep, state: State): void {
        creep.memory.state = state;
    }
}
