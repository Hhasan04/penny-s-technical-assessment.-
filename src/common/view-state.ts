/** loading / loaded / empty / error view-state, as a template switches on. */
export type ViewStatus = 'idle' | 'loading' | 'loaded' | 'empty' | 'error';

export interface ViewState<T> {
	status: ViewStatus;
	data: T | null;
	error?: string;
}

export function idle<T>(): ViewState<T> {
	return { status: 'idle', data: null };
}
export function loading<T>(): ViewState<T> {
	return { status: 'loading', data: null };
}
