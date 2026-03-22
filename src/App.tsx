import React, { useRef, useCallback, useEffect } from 'react';
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateDerived = useCallback(() => {
    if (gameRef.current) {
      setNodes(gameRef.current.getNodes());
      // Edges managed locally + persisted, no sync needed
    }
  }, [setNodes]);

  useEffect(() => {
    gameRef.current = new Game();
    // Demo factories
    gameRef.current.addFactory('mine-iron-1', 'mine-iron', { x: 100, y: 100 });
    gameRef.current.addFactory('mine-coal-1', 'mine-coal', { x: 300, y: 100 });
    gameRef.current.addFactory('smelt-steel-1', 'smelt-steel', { x: 200, y: 300 });
    updateDerived();
  }, [updateDerived]);

  const onConnect = useCallback((params: Connection) => {
    gameRef.current?.addEdge(params);
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', zIndex: 10, padding: 10 }}>
        <button onClick={() => { gameRef.current?.tick(); updateDerived(); }}>
          Tick (Advance Game)
        </button>
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