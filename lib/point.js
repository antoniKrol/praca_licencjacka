export class Point {
    constructor(x, y, z) {
        this._x = x;
        this._z = z;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get z() {
        return this._z;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }
    set z(z) {
        this._z = z;
    }

    equals(otherPoint) {
        return (
            this.x === otherPoint.x &&
            this.y === otherPoint.y &&
            this.z === otherPoint.z
        );
    }
}