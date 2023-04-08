// Function to merge close points and return the updated array
export function mergeClosePoints(points, newPoint, minDistance) {
    let merged = false;

    points.forEach((point) => {
        if (getDistance(point, newPoint) < minDistance) {
            point.x = (point.x + newPoint.x) / 2;
            point.y = (point.y + newPoint.y) / 2;
            point.z = (point.z + newPoint.z) / 2;
            merged = true;
        }
    });

    if (!merged) {
        points.push(newPoint);
    }

    return points;
}

// Funkcja zwracająca odległość między punktami p1 i p2 w przestrzeni 3D
export function getDistance(p1, p2) {
    // Oblicz odległość między punktami za pomocą wzoru na odległość w przestrzeni 3D
    const distance = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2) +
        Math.pow(p2.z - p1.z, 2)
    );
    return distance;
}

// Funkcja sprawdzająca, czy odległość między punktami p1 i p2 jest na tyle mała, że można ją interpretować jako stykanie palców
export function arePointsTouching(p1, p2) {
    // Jeśli odległość między punktami jest mniejsza niż 0.05, zwróć true, w przeciwnym razie zwróć false
    if (getDistance(p1, p2) < 0.05) {
        return true;
    } else {
        return false;
    }
}
