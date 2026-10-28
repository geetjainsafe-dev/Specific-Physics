export type Vec2 = { x: number; y: number };

export const G = 9.81;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

export function straightLineState(x0: number, v0: number, a: number, t: number) {
  return { x: x0 + v0 * t + 0.5 * a * t * t, v: v0 + a * t, a, t };
}

export function projectileStats(speed: number, angleDegrees: number, g = G) {
  const theta = degToRad(angleDegrees);
  const vx = speed * Math.cos(theta);
  const vy = speed * Math.sin(theta);
  const timeOfFlight = g > 0 ? (2 * vy) / g : 0;
  const maxHeight = g > 0 ? (vy * vy) / (2 * g) : 0;
  const range = g > 0 ? (speed * speed * Math.sin(2 * theta)) / g : 0;
  return { vx, vy, timeOfFlight: Math.max(0, timeOfFlight), maxHeight: Math.max(0, maxHeight), range: Math.max(0, range) };
}

export function projectilePosition(speed: number, angleDegrees: number, t: number, g = G): Vec2 {
  const theta = degToRad(angleDegrees);
  return { x: speed * Math.cos(theta) * t, y: speed * Math.sin(theta) * t - 0.5 * g * t * t };
}

export function frictionState(mass: number, appliedForce: number, muStatic: number, muKinetic: number, g = G, enabled = true) {
  const normal = mass * g;
  if (!enabled) return { normal, maxStatic: 0, friction: 0, netForce: appliedForce, acceleration: appliedForce / mass, moving: Math.abs(appliedForce) > 0, regime: 'frictionless' as const };
  const maxStatic = Math.max(0, muStatic) * normal;
  const friction = Math.abs(appliedForce) <= maxStatic ? -appliedForce : -Math.sign(appliedForce) * Math.max(0, muKinetic) * normal;
  const netForce = appliedForce + friction;
  const moving = Math.abs(appliedForce) > maxStatic;
  return { normal, maxStatic, friction, netForce, acceleration: moving ? netForce / mass : 0, moving, regime: moving ? 'kinetic' as const : 'static' as const };
}

export function atwoodState(m1: number, m2: number, g = G, pulleyInertia = 0, pulleyRadius = 0.1) {
  const effectiveMass = m1 + m2 + (pulleyRadius > 0 ? pulleyInertia / (pulleyRadius * pulleyRadius) : 0);
  const acceleration = effectiveMass > 0 ? ((m2 - m1) * g) / effectiveMass : 0;
  const tension1 = m1 * (g + acceleration);
  const tension2 = m2 * (g - acceleration);
  return { acceleration, tension1, tension2, netDrivingForce: (m2 - m1) * g, effectiveMass };
}

export function circularState(radius: number, mass: number, speed: number) {
  const r = Math.max(radius, 1e-9);
  return {
    angularSpeed: speed / r,
    period: speed > 0 ? (2 * Math.PI * r) / speed : Infinity,
    frequency: speed > 0 ? speed / (2 * Math.PI * r) : 0,
    centripetalAcceleration: (speed * speed) / r,
    centripetalForce: (mass * speed * speed) / r,
  };
}

export function vectorComponents(magnitude: number, angleDegrees: number): Vec2 {
  const angle = degToRad(angleDegrees);
  return { x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle) };
}

export function workByConstantForce(force: number, displacement: number, angleDegrees: number) {
  return force * displacement * Math.cos(degToRad(angleDegrees));
}

export function finalSpeedFromWork(initialSpeed: number, mass: number, work: number) {
  const finalKineticEnergy = Math.max(0, 0.5 * mass * initialSpeed * initialSpeed + work);
  return { finalKineticEnergy, finalSpeed: Math.sqrt((2 * finalKineticEnergy) / mass), wouldStop: 0.5 * mass * initialSpeed * initialSpeed + work < 0 };
}

export function springSHM(mass: number, springConstant: number, amplitude: number, phase: number, time: number) {
  const omega = Math.sqrt(springConstant / mass);
  const angle = omega * time + phase;
  const x = amplitude * Math.cos(angle);
  const v = -amplitude * omega * Math.sin(angle);
  const a = -omega * omega * x;
  return { omega, period: (2 * Math.PI) / omega, frequency: omega / (2 * Math.PI), x, v, a, kineticEnergy: 0.5 * mass * v * v, potentialEnergy: 0.5 * springConstant * x * x, totalEnergy: 0.5 * springConstant * amplitude * amplitude };
}

export function gravitationalAccelerationAtAltitude(planetMass: number, planetRadius: number, altitude: number, gravitationalConstant = 6.6743e-11) {
  const radius = planetRadius + altitude;
  if (radius <= 0) return Number.NaN;
  return (gravitationalConstant * planetMass) / (radius * radius);
}

export function hydrostaticPressure(density: number, depth: number, g = G, surfacePressure = 101325) {
  return surfacePressure + density * g * Math.max(0, depth);
}

export function buoyantForce(fluidDensity: number, displacedVolume: number, g = G) {
  return fluidDensity * displacedVolume * g;
}

export function calorimetryFinalTemperature(m1: number, c1: number, t1: number, m2: number, c2: number, t2: number) {
  const denominator = m1 * c1 + m2 * c2;
  return denominator > 0 ? (m1 * c1 * t1 + m2 * c2 * t2) / denominator : Number.NaN;
}

export function idealGasPressure(particles: number, temperature: number, volume: number, kB = 1.380649e-23) {
  return (particles * kB * temperature) / volume;
}

export function rmsMolecularSpeed(temperature: number, molarMassKgPerMol: number, gasConstant = 8.314462618) {
  return Math.sqrt((3 * gasConstant * temperature) / molarMassKgPerMol);
}

export function waveDisplacement(amplitude: number, wavelength: number, frequency: number, phase: number, x: number, time: number) {
  const k = (2 * Math.PI) / wavelength;
  const omega = 2 * Math.PI * frequency;
  return amplitude * Math.sin(k * x - omega * time + phase);
}

export function relativeMotionState(initialSeparation: Vec2, velocityA: Vec2, velocityB: Vec2, time: number, duration: number) {
  const relativeVelocity = { x: velocityB.x - velocityA.x, y: velocityB.y - velocityA.y };
  const separation = { x: initialSeparation.x + relativeVelocity.x * time, y: initialSeparation.y + relativeVelocity.y * time };
  const speedSquared = relativeVelocity.x ** 2 + relativeVelocity.y ** 2;
  const unconstrainedClosestTime = speedSquared > 0
    ? -(initialSeparation.x * relativeVelocity.x + initialSeparation.y * relativeVelocity.y) / speedSquared
    : 0;
  const closestTime = clamp(unconstrainedClosestTime, 0, Math.max(0, duration));
  const closestSeparation = {
    x: initialSeparation.x + relativeVelocity.x * closestTime,
    y: initialSeparation.y + relativeVelocity.y * closestTime,
  };
  return {
    relativeVelocity,
    relativeSpeed: Math.sqrt(speedSquared),
    separation,
    currentDistance: Math.hypot(separation.x, separation.y),
    closestTime,
    closestDistance: Math.hypot(closestSeparation.x, closestSeparation.y),
  };
}

export type RiverCrossingMode = 'minimum' | 'direct' | 'custom';
export function riverBoatState(width: number, currentSpeed: number, boatSpeed: number, customAngleDegrees = 0, mode: RiverCrossingMode = 'minimum') {
  const directPossible = currentSpeed < boatSpeed;
  const requiredAngle = directPossible ? Math.asin(currentSpeed / boatSpeed) * 180 / Math.PI : 90;
  const angleDegrees = mode === 'direct' ? requiredAngle : mode === 'minimum' ? 0 : customAngleDegrees;
  const angle = degToRad(angleDegrees);
  const acrossSpeed = Math.max(0, boatSpeed * Math.cos(angle));
  const downstreamSpeed = currentSpeed - boatSpeed * Math.sin(angle);
  const crossingTime = mode === 'direct' && !directPossible ? Infinity : acrossSpeed > 1e-12 ? Math.max(0, width) / acrossSpeed : Infinity;
  const drift = Number.isFinite(crossingTime) ? downstreamSpeed * crossingTime : Infinity;
  const feasible = Number.isFinite(crossingTime) && acrossSpeed > 0 && (mode !== 'direct' || directPossible);
  return { angleDegrees, requiredAngle, directPossible, acrossSpeed, downstreamSpeed, crossingTime, drift, feasible, groundSpeed: Math.hypot(downstreamSpeed, acrossSpeed) };
}

export function bankedRoadState(radius: number, angleDegrees: number, speed: number, coefficientStatic = 0.35, frictionEnabled = true, g = G) {
  const theta = degToRad(angleDegrees);
  const idealSpeed = Math.sqrt(Math.max(0, radius * g * Math.tan(theta)));
  const minNumerator = Math.sin(theta) - coefficientStatic * Math.cos(theta);
  const minDenominator = Math.cos(theta) + coefficientStatic * Math.sin(theta);
  const maxDenominator = Math.cos(theta) - coefficientStatic * Math.sin(theta);
  const minSpeed = frictionEnabled
    ? (minNumerator <= 0 ? 0 : Math.sqrt(Math.max(0, radius * g * minNumerator / minDenominator)))
    : idealSpeed;
  const maxSpeed = frictionEnabled
    ? (maxDenominator > 1e-12 ? Math.sqrt(Math.max(0, radius * g * (Math.sin(theta) + coefficientStatic * Math.cos(theta)) / maxDenominator)) : Infinity)
    : idealSpeed;
  const safe = speed >= minSpeed - 1e-9 && speed <= maxSpeed + 1e-9;
  const frictionDirection = angleDegrees === 0
    ? (speed === 0 ? 'Not required' : 'Radially inward')
    : speed > idealSpeed + 0.05
      ? 'Down the bank (toward inside)'
      : speed < idealSpeed - 0.05
        ? 'Up the bank (toward outside)'
        : 'No friction required at design speed';
  return { idealSpeed, minSpeed, maxSpeed, safe, frictionDirection };
}

export function torqueState(force: number, leverArm: number, angleDegrees: number) {
  const theta = degToRad(angleDegrees);
  const perpendicularForce = force * Math.sin(theta);
  const parallelForce = force * Math.cos(theta);
  const torque = leverArm * perpendicularForce;
  return {
    torque,
    perpendicularForce,
    parallelForce,
    momentArm: leverArm * Math.sin(theta),
    direction: Math.abs(torque) < 1e-12 ? 'Zero' : torque > 0 ? 'Counter-clockwise' : 'Clockwise',
  };
}


export function horizontalProjectileState(height: number, speed: number, g = G) {
  const h = Math.max(0, height);
  const gravity = Math.max(1e-9, g);
  const flightTime = Math.sqrt((2 * h) / gravity);
  return { flightTime, range: Math.max(0, speed) * flightTime, vx: Math.max(0, speed), vyImpact: -gravity * flightTime, impactSpeed: Math.hypot(Math.max(0, speed), gravity * flightTime), maxHeight: h };
}

export function inclinedProjectileState(speed: number, launchAngleDegrees: number, inclineAngleDegrees: number, g = G) {
  const u = Math.max(0, speed);
  const alpha = degToRad(launchAngleDegrees);
  const beta = degToRad(inclineAngleDegrees);
  const denominator = Math.sin(alpha) - Math.cos(alpha) * Math.tan(beta);
  if (g <= 0 || !Number.isFinite(denominator) || denominator <= 1e-10) {
    return { valid: false, impactTime: Number.NaN, horizontalRange: Number.NaN, rangeAlongIncline: Number.NaN, impactX: Number.NaN, impactY: Number.NaN, reason: 'The launch direction must intersect the incline in forward time.' };
  }
  const impactTime = (2 * u * denominator) / g;
  const impactX = u * Math.cos(alpha) * impactTime;
  const impactY = u * Math.sin(alpha) * impactTime - 0.5 * g * impactTime * impactTime;
  const rangeAlongIncline = impactX / Math.max(1e-10, Math.cos(beta));
  return { valid: impactTime >= 0 && Number.isFinite(impactTime), impactTime, horizontalRange: impactX, rangeAlongIncline, impactX, impactY, reason: '' };
}

export function oneDimensionalCollision(m1: number, m2: number, u1: number, u2: number, restitution: number) {
  const a = Math.max(1e-9, m1), b = Math.max(1e-9, m2), e = clamp(restitution, 0, 1);
  const momentumBefore = a * u1 + b * u2;
  const relativeApproachSpeed = u1 - u2;
  const v1 = ((a - e * b) * u1 + (1 + e) * b * u2) / (a + b);
  const v2 = ((b - e * a) * u2 + (1 + e) * a * u1) / (a + b);
  return { v1, v2, momentumBefore, momentumAfter: a * v1 + b * v2, kineticEnergyBefore: 0.5 * a * u1 * u1 + 0.5 * b * u2 * u2, kineticEnergyAfter: 0.5 * a * v1 * v1 + 0.5 * b * v2 * v2, relativeApproachSpeed, relativeSeparationSpeed: e * relativeApproachSpeed };
}

export function springForceState(mass: number, springConstant: number, displacement: number, initialVelocity = 0, g = G) {
  const m = Math.max(1e-9, mass), k = Math.max(1e-9, springConstant), x = displacement;
  const force = -k * x;
  const acceleration = force / m;
  const omega = Math.sqrt(k / m);
  return { displacement: x, force, acceleration, omega, period: 2 * Math.PI / omega, velocity: initialVelocity, potentialEnergy: 0.5 * k * x * x, assumptions: 'Ideal linear spring; displacement is measured from equilibrium; massless spring; no damping; Hooke’s law applies within the elastic limit.' };
}

export function cyclistLeanAngle(speed: number, radius: number, g = G) {
  return Math.atan((Math.max(0, speed) ** 2) / (Math.max(1e-9, radius) * g)) * 180 / Math.PI;
}

export function trainBankingState(speed: number, radius: number, bankAngleDegrees: number, mass = 1000, g = G) {
  const theta = degToRad(clamp(bankAngleDegrees, 0, 89));
  const v = Math.max(0, speed), r = Math.max(1e-9, radius), m = Math.max(1e-9, mass);
  const normal = m * g / Math.max(1e-9, Math.cos(theta));
  const inwardNormal = normal * Math.sin(theta);
  const requiredCentripetal = m * v * v / r;
  return { normal, weight: m * g, inwardNormal, requiredCentripetal, idealSpeed: Math.sqrt(r * g * Math.tan(theta)), netInwardWithoutFriction: inwardNormal, acceleration: v * v / r };
}

export function airplaneBankingState(speed: number, bankAngleDegrees: number, mass = 1000, g = G) {
  const v = Math.max(0, speed), phi = degToRad(clamp(bankAngleDegrees, 0, 89)), m = Math.max(1e-9, mass);
  const lift = m * g / Math.max(1e-9, Math.cos(phi));
  const horizontalLift = lift * Math.sin(phi);
  const radius = Math.abs(Math.tan(phi)) > 1e-9 ? v * v / (g * Math.tan(phi)) : Infinity;
  return { lift, verticalLift: lift * Math.cos(phi), horizontalLift, weight: m * g, radius, turnRate: Number.isFinite(radius) && radius > 0 ? v / radius : 0 };
}
