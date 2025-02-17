interface BoxShape {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BoxesRelationship {
    x: {
        event: string;
        times: number;
    };
    y: {
        event: string;
        times: number;
    };
}

type ClassField<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
