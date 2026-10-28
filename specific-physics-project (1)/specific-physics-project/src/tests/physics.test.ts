import { describe, expect, it } from 'vitest';
import {
  atwoodState,
  buoyantForce,
  calorimetryFinalTemperature,
  circularState,
  frictionState,
  gravitationalAccelerationAtAltitude,
  hydrostaticPressure,
  idealGasPressure,
  projectilePosition,
  projectileStats,
  straightLineState,
  vectorComponents,
  workByConstantForce,
  springSHM,
  waveDisplacement,
  relativeMotionState,
  riverBoatState,
  bankedRoadState,
  torqueState,
  horizontalProjectileState,
  inclinedProjectileState,
  oneDimensionalCollision,
  springForceState,
  cyclistLeanAngle,
  trainBankingState,
  airplaneBankingState,
} from '../physics';

const closeTo = (actual: number, expected: number, digits = 5) => expect(actual).toBeCloseTo(expected, digits);

describe('constant-acceleration kinematics', () => {
  it('calculates position and velocity at a known time', () => {
    expect(straightLineState(2, 3, 4, 2)).toEqual({ x: 16, v: 11, a: 4, t: 2 });
  });
  it('returns the launch and landing heights for ideal projectile motion', () => {
    const stats = projectileStats(20, 30, 10);
    closeTo(stats.timeOfFlight, 2);
    closeTo(stats.maxHeight, 5);
    closeTo(stats.range, 20 * Math.sqrt(3));
    closeTo(projectilePosition(20, 30, stats.timeOfFlight, 10).y, 0);
  });
});

describe('forces and connected systems', () => {
  it('static friction balances a sub-threshold force', () => {
    const state = frictionState(5, 10, 0.5, 0.3, 10, true);
    expect(state.regime).toBe('static');
    expect(state.friction).toBe(-10);
    expect(state.acceleration).toBe(0);
  });
  it('switches to kinetic friction above the static threshold', () => {
    const state = frictionState(5, 40, 0.5, 0.3, 10, true);
    expect(state.regime).toBe('kinetic');
    closeTo(state.friction, -15);
    closeTo(state.acceleration, 5);
  });
  it('accounts for pulley inertia and yields equal acceleration magnitudes', () => {
    const ideal = atwoodState(3, 5, 10);
    const massive = atwoodState(3, 5, 10, 0.5 * 2 * 0.25 ** 2, 0.25);
    closeTo(ideal.acceleration, 2.5);
    expect(massive.acceleration).toBeLessThan(ideal.acceleration);
    expect(massive.tension1).not.toBeCloseTo(massive.tension2, 5);
  });
  it('calculates circular acceleration and force', () => {
    const state = circularState(4, 3, 8);
    closeTo(state.centripetalAcceleration, 16);
    closeTo(state.centripetalForce, 48);
    closeTo(state.period, Math.PI);
  });
});

describe('vectors, work and oscillations', () => {
  it('resolves a vector into components', () => {
    const vector = vectorComponents(10, 30);
    closeTo(vector.x, 5 * Math.sqrt(3));
    closeTo(vector.y, 5);
  });
  it('calculates work with angle dependence', () => {
    closeTo(workByConstantForce(10, 5, 60), 25);
    closeTo(workByConstantForce(10, 5, 90), 0);
  });
  it('conserves total energy in ideal spring SHM', () => {
    const state = springSHM(2, 8, 0.5, 0, 0.7);
    closeTo(state.kineticEnergy + state.potentialEnergy, state.totalEnergy);
  });
});

describe('gravity, fluids, thermal physics and waves', () => {
  it('calculates lower gravity at altitude for the same planet', () => {
    const surface = gravitationalAccelerationAtAltitude(5.972e24, 6.371e6, 0);
    const above = gravitationalAccelerationAtAltitude(5.972e24, 6.371e6, 400000);
    expect(above).toBeLessThan(surface);
  });
  it('calculates hydrostatic pressure and buoyancy', () => {
    closeTo(hydrostaticPressure(1000, 2, 10, 100000), 120000);
    closeTo(buoyantForce(1000, 0.002, 10), 20);
  });
  it('finds a heat-capacity weighted equilibrium temperature', () => {
    closeTo(calorimetryFinalTemperature(1, 4000, 80, 1, 4000, 20), 50);
  });
  it('calculates ideal-gas pressure', () => {
    closeTo(idealGasPressure(1e23, 300, 0.01), 41419.47, 3);
  });
  it('calculates sinusoidal wave displacement from the wave model', () => {
    closeTo(waveDisplacement(2, 4, 1, 0, 1, 0), 2);
  });
});


describe('relative motion, river crossing and turning', () => {
  it('finds closest approach from relative velocity in a shared frame', () => {
    const state = relativeMotionState({ x: 10, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 0 }, 5, 10);
    closeTo(state.relativeVelocity.x, -2);
    closeTo(state.currentDistance, 0);
    closeTo(state.closestTime, 5);
    closeTo(state.closestDistance, 0);
  });
  it('calculates a direct-opposite river crossing when boat speed exceeds current', () => {
    const state = riverBoatState(100, 3, 5, 0, 'direct');
    closeTo(state.angleDegrees, Math.asin(3 / 5) * 180 / Math.PI);
    closeTo(state.crossingTime, 25);
    closeTo(state.drift, 0);
    expect(state.feasible).toBe(true);
  });
  it('rejects a finite direct crossing when current equals boat speed', () => {
    const state = riverBoatState(100, 5, 5, 0, 'direct');
    expect(state.feasible).toBe(false);
    expect(Number.isFinite(state.crossingTime)).toBe(false);
  });
  it('accepts the ideal speed as safe on a banked road', () => {
    const design = bankedRoadState(100, 30, 0, 0.3, true);
    const atDesign = bankedRoadState(100, 30, design.idealSpeed, 0.3, true);
    expect(atDesign.safe).toBe(true);
    expect(atDesign.maxSpeed).toBeGreaterThan(atDesign.minSpeed);
  });
  it('uses the force component perpendicular to the lever for signed torque', () => {
    closeTo(torqueState(10, 2, 90).torque, 20);
    closeTo(torqueState(10, 2, -90).torque, -20);
    closeTo(torqueState(10, 2, 0).torque, 0);
  });
});


describe('new mechanics lab models', () => {
  it('calculates horizontal projectile flight time and range', () => {
    const state = horizontalProjectileState(19.62, 10);
    closeTo(state.flightTime, 2);
    closeTo(state.range, 20);
    closeTo(state.impactSpeed, Math.sqrt(10 ** 2 + 19.62 ** 2));
  });
  it('finds impact on a lower incline and rejects invalid launch direction', () => {
    const valid = inclinedProjectileState(20, 50, 20, 10);
    expect(valid.valid).toBe(true);
    expect(valid.impactTime).toBeGreaterThan(0);
    expect(valid.rangeAlongIncline).toBeGreaterThan(0);
    expect(inclinedProjectileState(20, 10, 20, 10).valid).toBe(false);
  });
  it('conserves momentum for a one-dimensional collision', () => {
    const state = oneDimensionalCollision(2, 3, 5, -2, 0.8);
    closeTo(state.momentumBefore, state.momentumAfter);
    expect(state.kineticEnergyAfter).toBeLessThan(state.kineticEnergyBefore);
  });
  it('models Hooke restoring force opposite displacement', () => {
    const state = springForceState(2, 20, 0.5);
    closeTo(state.force, -10);
    closeTo(state.acceleration, -5);
    expect(state.assumptions).toContain('Hooke');
  });
  it('increases cyclist lean with speed and gives consistent turn-force components', () => {
    expect(cyclistLeanAngle(20, 30)).toBeGreaterThan(cyclistLeanAngle(10, 30));
    const train = trainBankingState(20, 100, 30);
    closeTo(train.normal * Math.cos(Math.PI / 6), train.weight);
    const plane = airplaneBankingState(50, 30, 1000);
    closeTo(plane.verticalLift, plane.weight);
    closeTo(plane.radius, 50 ** 2 / (9.81 * Math.tan(Math.PI / 6)));
  });
});
