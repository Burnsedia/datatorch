/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Suspense } from 'react'

import * as THREE from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import { useLoader, useThree } from 'react-three-fiber'
import { TrackballControls } from '@react-three/drei'

import { useMount } from 'react-use'

import { useColorModeValue, useTheme } from '@chakra-ui/react'
import { getColor } from '@chakra-ui/theme-tools'

import { ForwardContext } from '../utils/ForwardCanvas'

const url =
  'https://raw.githubusercontent.com/PointCloudLibrary/data/master/tutorials/room_scan2.pcd'

const PointCloudObject: React.FC = (): JSX.Element => {
  const points = useLoader(PCDLoader, url)
  const { camera } = useThree()

  const theme = useTheme()
  const pointColors = useColorModeValue('black', 'white')

  // center object
  useMount(() => {
    points.geometry.computeBoundingBox()
    const size = new THREE.Vector3()
    points.geometry.boundingBox.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = 50 * (Math.PI / 180)
    const cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2))
    camera.position.setZ(cameraZ)
  })

  return (
    <>
      <points geometry={points.geometry}>
        <pointsMaterial size={1 / 100} color={getColor(theme, pointColors)} />
      </points>
      {/* @ts-ignore */}
      <TrackballControls target={points.geometry.boundingSphere.center} />
    </>
  )
}

const PanelPointCloudData: React.FC = () => {
  return (
    <ForwardContext>
      <Suspense fallback={null}>
        <PointCloudObject />
      </Suspense>
    </ForwardContext>
  )
}

export default PanelPointCloudData
