// Undernite - the Goliath suit as a realistic underwater robot: a hard-shell atmospheric
// diving suit / work robot with a pressure hull, glass dome with the pilot inside,
// rotary joints, claw manipulators, ducted thrusters, floodlights and hydraulic hoses.
// Forward is -z. Returns { g, legs, arms, mech: true, gunGlow, animate }.
import * as THREE from 'three';

const TAU = Math.PI * 2;
const M = {
  paint: () => new THREE.MeshStandardMaterial({ color: 0xe9a417, roughness: 0.5, metalness: 0.25 }),          // safety yellow
  steel: new THREE.MeshStandardMaterial({ color: 0x9aa3ab, roughness: 0.32, metalness: 0.85 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2c3238, roughness: 0.5, metalness: 0.6 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: 0.9, metalness: 0 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xbfefff, roughness: 0.04, metalness: 0.2, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide }),
  pilot: new THREE.MeshStandardMaterial({ color: 0x30363d, roughness: 0.8 }),
  face: new THREE.MeshStandardMaterial({ color: 0xc4977a, roughness: 0.7 }),
  lens: new THREE.MeshStandardMaterial({ color: 0xfff4d0, emissive: 0xfff4d0, emissiveIntensity: 3 }),
  beam: new THREE.MeshBasicMaterial({ color: 0xfff1c4, transparent: true, opacity: 0.035, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
};
const G = {
  cylX: new THREE.CylinderGeometry(1, 1, 1, 18).rotateZ(Math.PI / 2),     // axis along x (joints)
  cylY: new THREE.CylinderGeometry(1, 1, 1, 18),                           // axis along y (limbs)
  cylZ: new THREE.CylinderGeometry(1, 1, 1, 18).rotateX(Math.PI / 2),      // axis along z
  duct: new THREE.CylinderGeometry(1, 1, 1, 24, 1, true).rotateX(Math.PI / 2),
  ring: new THREE.TorusGeometry(1, 0.08, 8, 28),
  sph: new THREE.SphereGeometry(1, 18, 12),
  box: new THREE.BoxGeometry(1, 1, 1),
  blade: new THREE.BoxGeometry(0.06, 0.2, 0.02),
  beam: new THREE.ConeGeometry(1, 1, 16, 1, true).translate(0, -0.5, 0).rotateX(-Math.PI / 2),   // tip at origin, opens towards -z
};
function part(parent, geo, mat, x, y, z, sx = 1, sy = sx, sz = sx) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
}
// a rotary joint: steel drum with two thin bolt rings
function joint(parent, x, y, z, r, len) {
  part(parent, G.cylX, M.steel, x, y, z, len, r, r);
  for (const s of [-1, 1]) part(parent, G.cylX, M.dark, x + s * len * 0.42, y, z, len * 0.12, r * 1.08, r * 1.08);
}
function propeller(parent, axis) {
  const p = new THREE.Group(); parent.add(p);
  part(p, axis === 'z' ? G.cylZ : G.cylY, M.dark, 0, 0, 0, 0.07, 0.08, 0.07);
  for (let i = 0; i < 4; i++) {
    const b = part(p, G.blade, M.steel, 0, 0, 0);
    if (axis === 'z') { b.rotation.z = i * TAU / 4; b.translateY(0.12); b.rotation.y = 0.5; }
    else { b.rotation.set(Math.PI / 2, 0, i * TAU / 4); b.translateY(0.12); }
  }
  return p;
}
function hose(parent, pts) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
  parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.035, 6), M.rubber));
}

export function buildRobotMech(accent) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  g.scale.setScalar(1.3);   // about 3 m tall, matches the suit's hit radius
  body.position.y = 0.2;
  const paint = M.paint(), stripe = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.6, roughness: 0.4 });

  // ----- pressure hull (lathed barrel) with weld bands and an accent stripe -----
  const prof = [[0, -0.55], [0.5, -0.52], [0.7, -0.3], [0.78, 0.05], [0.76, 0.4], [0.62, 0.68], [0.46, 0.78], [0, 0.8]].map(([r, y]) => new THREE.Vector2(r, y));
  const hull = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), paint); hull.position.y = 0.35; hull.scale.set(1, 1, 0.86); body.add(hull);
  for (const y of [0.2, 0.62]) { const r = part(body, G.ring, M.steel, 0, y, 0, 0.78, 0.78, 0.67); r.rotation.x = Math.PI / 2; }
  part(body, G.box, stripe, 0, 0.45, -0.66, 0.6, 0.07, 0.04);                         // accent stripe (player colour)
  part(body, G.box, M.dark, 0, 0.05, -0.64, 0.42, 0.3, 0.06);                         // front instrument panel
  for (let i = 0; i < 3; i++) part(body, G.sph, M.lens, -0.12 + i * 0.12, 0.1, -0.68, 0.025);   // status LEDs

  // ----- glass dome with the pilot inside -----
  const neck = part(body, G.ring, M.steel, 0, 1.12, -0.02, 0.44, 0.44, 0.44); neck.rotation.x = Math.PI / 2;
  part(body, new THREE.SphereGeometry(0.44, 28, 16, 0, TAU, 0, Math.PI * 0.62), M.glass, 0, 1.12, -0.02);
  part(body, G.sph, M.pilot, 0, 1.22, 0.02, 0.17, 0.19, 0.17);                         // pilot's hood
  part(body, G.sph, M.face, 0, 1.22, -0.12, 0.1, 0.11, 0.06);                          // face
  part(body, G.box, M.pilot, 0, 1.05, 0.03, 0.42, 0.12, 0.26);                         // shoulders
  const frame = part(body, G.ring, M.dark, 0, 1.3, -0.02, 0.36, 0.36, 0.36); frame.rotation.y = Math.PI / 2;   // dome rib

  // ----- floodlights with soft light cones + navigation lights -----
  const beams = [];
  for (const sx of [-1, 1]) {
    part(body, G.cylZ, M.dark, sx * 0.42, 1.24, -0.28, 0.09, 0.09, 0.24);
    part(body, G.cylZ, M.lens, sx * 0.42, 1.24, -0.41, 0.075, 0.075, 0.02);
    const b = part(body, G.beam, M.beam, sx * 0.42, 1.24, -0.42, 0.45, 0.45, 3.5); b.rotation.x = -0.1; beams.push(b);
  }
  const navR = part(body, G.sph, new THREE.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff2a2a, emissiveIntensity: 3 }), -0.66, 0.78, 0.1, 0.045);
  const navG = part(body, G.sph, new THREE.MeshStandardMaterial({ color: 0x2aff6a, emissive: 0x2aff6a, emissiveIntensity: 3 }), 0.66, 0.78, 0.1, 0.045);

  // ----- back pack: frame, battery pods, two ducted thrusters + a vertical one -----
  part(body, G.box, M.dark, 0, 0.35, 0.72, 1.0, 0.95, 0.32);
  for (const sx of [-1, 1]) {
    const bat = part(body, new THREE.CapsuleGeometry(0.15, 0.6, 4, 12), paint, sx * 0.32, 0.4, 0.95); bat.rotation.z = 0;
    part(body, G.ring, M.dark, sx * 0.32, 0.65, 0.95, 0.16, 0.16, 0.16).rotation.x = Math.PI / 2;
  }
  const props = [];
  for (const sx of [-1, 1]) {
    part(body, G.duct, M.steel, sx * 0.66, 0.05, 0.95, 0.26, 0.26, 0.38);
    part(body, G.ring, M.dark, sx * 0.66, 0.05, 0.76, 0.27, 0.27, 0.27);
    part(body, G.box, M.dark, sx * 0.45, 0.05, 0.9, 0.22, 0.05, 0.05);               // strut
    const p = propeller(body, 'z'); p.position.set(sx * 0.66, 0.05, 0.95); props.push(p);
  }
  const vduct = part(body, G.cylY, M.steel, 0, 0.98, 0.78, 0.24, 0.22, 0.24); vduct.material = M.steel;
  const vprop = propeller(body, 'y'); vprop.position.set(0, 1.1, 0.78);
  part(body, G.cylY, M.dark, 0.3, 1.25, 0.7, 0.015, 0.5, 0.015);                      // antenna

  // ----- arms: rotary shoulder, upper arm, elbow, forearm, wrist and a two-finger claw -----
  const arms = [], fingers = [];
  let gunGlow = null;
  for (const sx of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sx * 0.9, 0.55, -0.05); body.add(sh);
    joint(sh, 0, 0, 0, 0.22, 0.28);
    part(sh, G.cylY, paint, 0, -0.33, 0, 0.15, 0.5, 0.15);
    part(sh, G.ring, M.steel, 0, -0.2, 0, 0.16, 0.16, 0.16).rotation.x = Math.PI / 2;
    const el = new THREE.Group(); el.position.y = -0.66; sh.add(el);
    joint(el, 0, 0, 0, 0.17, 0.26);
    part(el, G.cylZ, paint, 0, 0, -0.32, 0.13, 0.13, 0.5);
    part(el, G.cylZ, M.steel, 0, 0, -0.6, 0.11, 0.11, 0.1);                           // wrist rotator
    const claw = new THREE.Group(); claw.position.z = -0.68; el.add(claw);
    for (const fy of [-1, 1]) {
      const f = new THREE.Group(); f.position.y = fy * 0.05; claw.add(f);
      part(f, G.box, M.dark, 0, fy * 0.04, -0.12, 0.07, 0.05, 0.24);
      part(f, G.box, M.dark, 0, fy * 0.0, -0.25, 0.07, 0.05, 0.1);
      fingers.push({ f, fy });
    }
    if (sx > 0) {   // weapon pod under the right forearm (glows in the weapon's colour)
      gunGlow = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffe066, emissiveIntensity: 1.3 });
      part(el, G.cylZ, M.dark, 0, -0.19, -0.35, 0.08, 0.08, 0.55);
      part(el, G.cylZ, gunGlow, 0, -0.19, -0.66, 0.035, 0.035, 0.12);
    }
    arms.push(sh);
    hose(body, [[sx * 0.4, 0.7, 0.6], [sx * 0.85, 0.85, 0.35], [sx * 1.0, 0.5, 0.05], [sx * 1.0, -0.1, -0.05]]);   // hydraulic line
  }

  // ----- legs: hip joint, thigh, knee, shin, heavy boot with tread -----
  const legs = [], knees = [];
  for (const sx of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(sx * 0.34, -0.42, 0); body.add(hip);
    joint(hip, 0, 0, 0, 0.21, 0.32);
    part(hip, G.cylY, paint, 0, -0.38, 0, 0.18, 0.55, 0.18);
    const knee = new THREE.Group(); knee.position.y = -0.72; hip.add(knee);
    joint(knee, 0, 0, 0, 0.19, 0.3);
    part(knee, G.cylY, paint, 0, -0.34, 0, 0.16, 0.5, 0.16);
    part(knee, G.ring, M.steel, 0, -0.55, 0, 0.17, 0.17, 0.17).rotation.x = Math.PI / 2;
    part(knee, G.box, M.rubber, 0, -0.7, -0.08, 0.34, 0.16, 0.6);                    // boot
    for (let i = 0; i < 4; i++) part(knee, G.box, M.dark, 0, -0.79, -0.32 + i * 0.16, 0.35, 0.03, 0.05);   // tread
    legs.push(hip); knees.push(knee);
    hose(body, [[sx * 0.2, -0.1, 0.55], [sx * 0.45, -0.35, 0.3], [sx * 0.42, -0.75, 0.15]]);
  }

  let t = 0, grip = 0;
  return {
    g, legs, arms, mech: true, gunGlow,
    // walk-swim: legs stride slowly, thrusters spin with speed, lights blink, claws open and close
    animate(dt, s, phase, amp) {
      t += dt;
      const sp = Math.min(1, s.speed / 6);
      body.rotation.x = s.pitch * 0.2;
      for (const a of arms) a.rotation.x = s.pitch * 0.9;
      for (let i = 0; i < 2; i++) {
        const ph = phase * 0.55 + i * Math.PI;
        legs[i].rotation.x = Math.sin(ph) * (0.08 + sp * 0.4);
        knees[i].rotation.x = -Math.max(0, Math.sin(ph + 1.2)) * (0.1 + sp * 0.5);
      }
      for (const p of props) p.rotation.z += dt * (4 + s.speed * 6);
      vprop.rotation.y += dt * (5 + Math.abs(s.vy || 0) * 8);
      const blink = (t % 1.6) < 0.12;
      navR.material.emissiveIntensity = blink ? 6 : 1.2; navG.material.emissiveIntensity = blink ? 6 : 1.2;
      for (const b of beams) b.material.opacity = 0.032 + Math.sin(t * 7) * 0.003;
      grip += ((s.firing ? 1 : 0) - grip) * Math.min(1, dt * 6);
      for (const { f, fy } of fingers) f.rotation.x = fy * (0.35 - grip * 0.3);
      body.position.y = 0.2 + Math.sin(t * 1.3) * 0.03;   // slight buoyancy bob
    },
  };
}
