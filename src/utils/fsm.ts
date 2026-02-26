/**
 * 状态转移目标解析
 */
function resolveTransition<S extends PropertyKey, T>(entity: T, transition: FSM.Transition<S, T>): S | null {
    return typeof transition === 'function' ? (transition as (entity: T) => S | null)(entity) : transition;
}

/**
 * 状态机基类
 * @typeParam T 实体类型, 通常是 Creep 或 Room 等游戏对象, 用于状态判断和执行逻辑
 * @typeParam S 状态类型, 必须是数字或字符串等可作为对象键的类型, 用于定义状态枚举
 */
export abstract class FSM<T, S extends PropertyKey> {
    /** 定义状态配置 */
    protected abstract readonly states: FSM.Config<S, T>;
    /** 定义初始状态 */
    protected abstract readonly initialState: S;

    /** 获取实体当前状态 */
    protected abstract getState(entity: T): S | undefined;
    /** 设置实体状态 */
    protected abstract setState(entity: T, state: S): void;

    /**
     * 运行状态机
     */
    run(entity: T): void {
        // 初始化状态
        if (this.getState(entity) === undefined) {
            this.checkoutTo(entity, this.initialState);
        }

        const currentState = this.getState(entity) as S;
        const stateConfig = this.states[currentState];

        if (!stateConfig) {
            console.log(`[FSM] Invalid state: ${String(currentState)}`);
            return;
        }

        // 检查转移条件
        if (stateConfig.transitions) {
            for (const transition of stateConfig.transitions) {
                const nextState = resolveTransition(entity, transition);
                if (nextState !== null && nextState !== currentState) {
                    this.checkoutTo(entity, nextState);
                    break;
                }
            }
        }

        // 执行当前状态
        stateConfig.onExecute(entity);
    }

    /**
     * 响应事件，触发可能的状态转移
     */
    react(entity: T, event: FSM.Event): void {
        const currentState = this.getState(entity) as S;
        const stateConfig = this.states[currentState];

        if (!stateConfig?.reactions) return;

        const entry = stateConfig.reactions.find(([e]) => e === event);
        if (entry) {
            const nextState = resolveTransition(entity, entry[1]);
            if (nextState !== null && nextState !== currentState) {
                this.checkoutTo(entity, nextState);
            }
        }
    }

    /**
     * 切换状态
     */
    protected checkoutTo(entity: T, nextState: S): void {
        const currentState = this.getState(entity);
        const currentConfig = currentState !== undefined ? this.states[currentState] : null;
        const nextConfig = this.states[nextState];

        currentConfig?.onExit?.(entity);
        this.setState(entity, nextState);
        nextConfig?.onEnter?.(entity);
        nextConfig?.onExecute(entity);
    }

    /**
     * 检查是否处于指定状态
     */
    protected isIn(entity: T, ...states: S[]): boolean {
        return states.includes(this.getState(entity) as S);
    }
}

/**
 * FSM 相关类型与辅助函数
 */
export namespace FSM {
    /** 事件标识 */
    export type Event = symbol;

    /** 创建事件 */
    export function defineEvent(name: string): Event {
        return Symbol(name);
    }

    /** 状态转移目标：状态值、或根据实体动态决定的状态 */
    export type Transition<S extends PropertyKey, T> = S | ((entity: T) => S | null);

    /** 条件判断函数 */
    export type Condition<T> = (entity: T) => boolean;

    /** 状态配置 */
    export interface StateConfig<S extends PropertyKey, T> {
        /** 进入状态时执行 */
        onEnter?: (entity: T) => void;
        /** 每个 tick 执行 */
        onExecute: (entity: T) => void;
        /** 离开状态时执行 */
        onExit?: (entity: T) => void;
        /* 转移条件列表 */
        transitions?: Transition<S, T>[];
        /* 事件响应列表 */
        reactions?: [Event, Transition<S, T>][];
    }

    /** 状态机配置 */
    export type Config<S extends PropertyKey, T> = {
        [K in S]: StateConfig<S, T>;
    };

    /** 创建转移条件 */
    export function when<S extends PropertyKey, T>(condition: Condition<T>, toState: Transition<S, T>): Transition<S, T> {
        return (entity) => condition(entity) ? resolveTransition(entity, toState) : null;
    }

    /** 组合多个 Transition，返回第一个匹配的结果 */
    export function branch<S extends PropertyKey, T>(...transitions: Transition<S, T>[]): Transition<S, T> {
        return (entity) => {
            for (const transition of transitions) {
                const result = resolveTransition(entity, transition);
                if (result !== null) return result;
            }
            return null;
        };
    }

    /** 创建事件响应 */
    export function on<S extends PropertyKey, T>(event: Event, toState: Transition<S, T>): [Event, Transition<S, T>] {
        return [event, toState];
    }
}
