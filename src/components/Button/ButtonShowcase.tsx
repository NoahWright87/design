import React from 'react';
import { Button } from './Button';

export const ButtonShowcase: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Colors</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="warning">Warning Button</Button>
          <Button variant="error">Error Button</Button>
        </div>
      </div>
      
      <div>
        <h3>Sizes</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Button size="small">Small Button</Button>
          <Button size="medium">Medium Button</Button>
          <Button size="large">Large Button</Button>
        </div>
      </div>
      
      <div>
        <h3>States</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Button>Normal Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </div>
    </div>
  );
}; 