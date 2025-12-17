import React, { useEffect, useState, useRef } from 'react';
import { ParticleBurst } from '@jbcom/strata';
import { queries } from '../../ecs/world';

interface Burst {
  id: number;
  position: [number, number, number];
  color: string;
}

/**
 * Collection Burst Effect using @jbcom/strata ParticleBurst
 * Creates particle explosions when items are collected
 */
export function CollectionBurst(): React.JSX.Element {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const unsubscribe = queries.collected.onEntityAdded.subscribe((entity) => {
      if (entity.collectible) {
        const color =
          entity.collectible.type === 'coin' ? '#ffd700' : '#ff1493';
        const burst: Burst = {
          id: nextIdRef.current++,
          position: [entity.position.x, entity.position.y, entity.position.z],
          color,
        };

        setBursts((prev) => [...prev, burst]);

        // Remove after animation completes
        window.setTimeout(() => {
          setBursts((prev) => prev.filter((b) => b.id !== burst.id));
        }, 1500);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <group>
      {bursts.map((burst) => (
        <ParticleBurst
          key={burst.id}
          trigger={burst.id}
          position={burst.position}
          count={20}
          velocity={[0, 2, 0]}
          velocityVariance={[2, 2, 2]}
          lifetime={1}
          startColor={burst.color}
          endColor={burst.color}
          startSize={0.1}
          endSize={0.02}
          startOpacity={1}
          endOpacity={0}
        />
      ))}
    </group>
  );
}
