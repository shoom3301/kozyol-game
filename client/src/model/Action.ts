export interface Action<T, R = any> {
    type: T;
    payload: R;
}