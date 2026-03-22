import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import type { Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import FactoryNode from './components/FactoryNode';
import { Game } from './engine/Game';
import type { GameEdges, GameNodes } from './types';

const nodeTypes = { factory: FactoryNode };

const initialNodes: GameNodes = [];
const initialEdges: GameEdges = [];

const App: React.FC = () => {
  const gameRef = useRef<Game | null>(null);
  const [autoTickEnabled, setAutoTickEnabled] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateDerived = useCallback(() => {
    if (gameRef.current) {
      setNodes(gameRef.current.getNodes());
      // Edges managed locally + persisted, no sync needed
    }
  }, [setNodes]);

  const manualTick = useCallback(() => {
    gameRef.current?.tick();
    updateDerived();
  }, [updateDerived]);

  useEffect(() => {
    gameRef.current = new Game();
    // Demo factories
    gameRef.current.addFactory('mine-iron-1', 'mine-iron', { x: 100, y: 100 });
    gameRef.current.addFactory('mine-coal-1', 'mine-coal', { x: 300, y: 100 });
    gameRef.current.addFactory('smelt-steel-1', 'smelt-steel', { x: 200, y: 300 });
    gameRef.current!.addEdge({ source: 'mine-iron-1', target: 'smelt-steel-1', sourceHandle: null, targetHandle: null });
    gameRef.current!.addEdge({ source: 'mine-coal-1', target: 'smelt-steel-1', sourceHandle: null, targetHandle: null });
    setEdges(gameRef.current!.getEdges());
    updateDerived();
  }, [updateDerived]);

  useEffect(() => {
    if (autoTickEnabled) {
      intervalRef.current = setInterval(() => {
        gameRef.current?.tick();
        updateDerived();
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoTickEnabled, updateDerived]);

  const onConnect = useCallback((params: Connection) => {
    gameRef.current?.addEdge(params);
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', zIndex: 10, padding: 10 }}>
        <div className="controls">
          <button onClick={manualTick}>
            Tick (Advance Game)
          </button>
          <input type="checkbox" id="autoTick" checked={autoTickEnabled} onChange={(e) => setAutoTickEnabled(e.target.checked)} />
          <label htmlFor="autoTick">Auto-tick (100ms)</label>
        </div>
        <div>Grams produced: Watch miners fill smelter!</div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={(deletedEdges) => { deletedEdges.forEach(edge => gameRef.current?.removeEdge(edge.id)); }}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default App;