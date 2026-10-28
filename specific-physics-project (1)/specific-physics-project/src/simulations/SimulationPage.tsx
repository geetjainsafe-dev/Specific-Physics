import { ArrowLeft, FlaskConical } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AtwoodLab } from './labs/AtwoodLab';
import { BankedRoadLab } from './labs/BankedRoadLab';
import { CircularLab } from './labs/CircularLab';
import { FluidsLab } from './labs/FluidsLab';
import { FrictionLab } from './labs/FrictionLab';
import { GravitationLab } from './labs/GravitationLab';
import { KineticTheoryLab } from './labs/KineticTheoryLab';
import { AirplaneBankingLab, CyclistLeaningLab, HorizontalProjectileLab, InclinedProjectileLab, ParticleCollisionLab, SpringForceLab, TrainBankingLab } from './labs/MechanicsExtrasLab';
import { ProjectileLab } from './labs/ProjectileLab';
import { RelativeMotionLab } from './labs/RelativeMotionLab';
import { RiverBoatLab } from './labs/RiverBoatLab';
import { SolidsLab } from './labs/SolidsLab';
import { SpringSHMLab } from './labs/SpringSHMLab';
import { StraightLineLab } from './labs/StraightLineLab';
import { ThermalLab } from './labs/ThermalLab';
import { TorqueLab } from './labs/TorqueLab';
import { ThermodynamicsLab } from './labs/ThermodynamicsLab';
import { UnitConverterLab } from './labs/UnitConverterLab';
import { VectorLab } from './labs/VectorLab';
import { WavesLab } from './labs/WavesLab';
import { WorkEnergyLab } from './labs/WorkEnergyLab';

const labComponents: Record<string, () => JSX.Element> = {
  'unit-converter': UnitConverterLab,
  'straight-line': StraightLineLab,
  projectile: ProjectileLab,
  'relative-motion': RelativeMotionLab,
  'river-boat': RiverBoatLab,
  'banked-road': BankedRoadLab,
  vectors: VectorLab,
  friction: FrictionLab,
  atwood: AtwoodLab,
  circular: CircularLab,
  'work-energy': WorkEnergyLab,
  torque: TorqueLab,
  'spring-shm': SpringSHMLab,
  gravitation: GravitationLab,
  solids: SolidsLab,
  fluids: FluidsLab,
  thermal: ThermalLab,
  thermodynamics: ThermodynamicsLab,
  'kinetic-theory': KineticTheoryLab,
  waves: WavesLab,
  'horizontal-projectile': HorizontalProjectileLab,
  'inclined-projectile': InclinedProjectileLab,
  'particle-collision': ParticleCollisionLab,
  'spring-force': SpringForceLab,
  'cyclist-leaning': CyclistLeaningLab,
  'train-banking': TrainBankingLab,
  'airplane-banking': AirplaneBankingLab,
};

export function SimulationPage() {
  const { simulationId = '' } = useParams();
  const Lab = labComponents[simulationId];
  if (!Lab) return <div className="page-content not-found"><div className="not-found-icon"><FlaskConical size={27}/></div><h1>That lab isn't in this build yet.</h1><p>This project includes a focused set of working interactive models, with the full chapter map available for navigation.</p><Link to="/" className="button-primary"><ArrowLeft size={15}/> Return to overview</Link></div>;
  return <Lab/>;
}
