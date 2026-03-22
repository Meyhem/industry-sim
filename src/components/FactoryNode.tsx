import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { FactoryNodeData } from '../types';
import { Item } from '../types';

interface FactoryNodeProps extends NodeProps<FactoryNodeData> {}

const FactoryNode: React.FC<FactoryNodeProps> = ({ data }) => {
  const progressPercent = data.progress > 0 ? ((data.maxTicks - data.progress) / data.maxTicks) * 100 : 0;

  const renderInventory = (summary: Partial<Record<Item, number>>, title: string) => (
    <div>
      <strong>{title}:</strong>
      <ul style={{ fontSize: '10px', margin: 0, paddingLeft: '10px' }}>
        {Object.entries(summary).map(([item, qty]) => (
          <li key={item}>{item}: {qty}g</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{
      padding: 10,
      border: '1px solid #777',
      borderRadius: 5,
      background: 'white',
      minWidth: 120,
      maxWidth: 150,
      fontSize: 12,
    }}>
      <Handle type="target" position={Position.Top} />
      <div><strong>{data.recipeName}</strong></div>
      <div style={{ height: 4, background: '#eee', borderRadius: 2, overflow: 'hidden', margin: '5px 0' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: progressPercent ? '#4ade80' : '#94a3b8' }} />
      </div>
      <div style={{ fontSize: 10 }}>Progress: {data.progress} ticks</div>
      {renderInventory(data.inputSummary, 'In')}
      {renderInventory(data.outputSummary, 'Out')}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default FactoryNode;