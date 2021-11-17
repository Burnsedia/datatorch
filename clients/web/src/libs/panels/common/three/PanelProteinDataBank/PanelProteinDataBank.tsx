/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Suspense, useRef } from 'react'

import * as THREE from 'three'
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader'
import { useLoader } from 'react-three-fiber'
import { Box, Html, Icosahedron, TrackballControls } from '@react-three/drei'
import { useMount } from 'react-use'
import { Text } from '@chakra-ui/react'
import { ForwardContext } from '../utils/ForwardCanvas'

const url = 'https://threejs.org/examples/models/pdb/caffeine.pdb'

const Atom: React.FC<{
  position: THREE.Vector3
  color: THREE.Color
  text: string
  textColor: string
}> = ({ position, color, text, textColor }) => {
  return (
    <>
      <mesh visible position={position}>
        {/* @ts-ignore */}
        <Icosahedron attach="geometry" args={[1, 3]}>
          <meshPhongMaterial attach="material" color={color} />
        </Icosahedron>
        <Html>
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="bold"
            textShadow="-1px 1px 1px rgb(0,0,0)"
            marginLeft="10"
            userSelect="none"
          >
            {text}
          </Text>
        </Html>
      </mesh>
    </>
  )
}

const AtomBond: React.FC<{ start: THREE.Vector3; end: THREE.Vector3 }> = ({
  start,
  end
}) => {
  const el = useRef<THREE.Mesh>()
  useMount(() => {
    el.current.position.copy(start)
    el.current.position.lerp(end, 0.5)
    el.current.scale.set(5, 5, start.distanceTo(end))
    el.current.lookAt(end)
  })

  return (
    <mesh ref={el} visible>
      {/* @ts-ignore */}
      <Box args={[0.05, 0.05, 1]} attach="geometry">
        <meshPhongMaterial color="#ffffff" />
      </Box>
    </mesh>
  )
}

const Molecule: React.FC = () => {
  const { geometryAtoms, geometryBonds, json } = useLoader(PDBLoader, url)

  const atomPositions = geometryAtoms.getAttribute('position')
  const atomColors = geometryAtoms.getAttribute('color')
  const atoms = Array.from({ length: atomPositions.count }, (_, i) => i).map(
    idx => {
      const position = new THREE.Vector3(
        atomPositions.getX(idx),
        atomPositions.getY(idx),
        atomPositions.getZ(idx)
      )
      const color = new THREE.Color(
        atomColors.getX(idx),
        atomColors.getY(idx),
        atomColors.getZ(idx)
      )
      const atom = json.atoms[idx]
      const textColor = `rgb(${atom[3][0]}, ${atom[3][1]}, ${atom[3][2]})`
      return (
        <Atom
          key={idx}
          color={color}
          text={atom[4]}
          textColor={textColor}
          position={position.multiplyScalar(3)}
        />
      )
    }
  )

  const bondPositions = geometryBonds.getAttribute('position')
  const bonds = Array.from(
    { length: bondPositions.count / 2 },
    (_, i) => i * 2
  ).map(idx => {
    const start = new THREE.Vector3(
      bondPositions.getX(idx),
      bondPositions.getY(idx),
      bondPositions.getZ(idx)
    ).multiplyScalar(3)
    const end = new THREE.Vector3(
      bondPositions.getX(idx + 1),
      bondPositions.getY(idx + 1),
      bondPositions.getZ(idx + 1)
    ).multiplyScalar(3)
    return <AtomBond key={idx} start={start} end={end} />
  })

  return (
    <>
      <directionalLight args={[0xffffff, 0.8]} position={[1, 1, 1]} />
      <directionalLight args={[0xffffff, 0.5]} position={[-1, -1, 1]} />
      <ambientLight intensity={0.1} />
      {atoms}
      {bonds}
      {/* @ts-ignore */}
      <TrackballControls />
    </>
  )
}

const PanelPointCloudData: React.FC = () => {
  return (
    <ForwardContext>
      <Suspense fallback={null}>
        <Molecule />
      </Suspense>
    </ForwardContext>
  )
}

export default PanelPointCloudData
