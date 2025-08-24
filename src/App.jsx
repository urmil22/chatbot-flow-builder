import { useState, useCallback } from 'react';
import {
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import FlowBuilder from './components/FlowBuilder';
import NodesPanel from './components/NodesPanel';
import SettingsPanel from './components/SettingsPanel';
import './App.css';
import { BiMessageRoundedDetail } from "react-icons/bi";

/**
 * Main App Component
 * Orchestrates the entire flow builder application
 * Manages global state for nodes, edges, panels, and selected elements
 */
function App() {
  // Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state management
  const [selectedNode, setSelectedNode] = useState(null);
  const [activePanel, setActivePanel] = useState('nodes');
  const [showPanel, setShowPanel] = useState(false);
  const [saveError, setSaveError] = useState('');

  /**
   * Handle new connections between nodes
   * Validates and adds edges with source handle constraint
   */
  const onConnect = useCallback((params) => {
    // Check if source already has a connection (enforce single outgoing edge)
    const sourceHasConnection = edges.some(
      (edge) => edge.source === params.source
    );

    if (!sourceHasConnection) {
      setEdges((eds) => addEdge(params, eds));
    }
  }, [edges, setEdges]);

  /**
   * Handle node selection
   * Opens settings panel when a node is clicked
   */
  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setActivePanel('settings');
    setShowPanel(true);
  }, []);

  /**
   * Handle pane click (clicking on empty area)
   * Deselects current node and closes settings panel
   */
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    if (activePanel === 'settings') {
      setShowPanel(false);
    }
  }, [activePanel]);

  /**
   * Update node data
   * Updates specific node properties while maintaining immutability
   */
  const onNodeUpdate = useCallback((nodeId, newData) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  /**
   * Validate flow before saving
   * Checks if there are nodes with empty target handles (disconnected nodes)
   */
  const validateFlow = () => {
    if (nodes.length <= 1) {
      return null; // No validation needed for 0 or 1 nodes
    }

    // Find nodes that don't have incoming connections (empty target handles)
    const nodesWithoutTargets = nodes.filter((node) => {
      const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
      return !hasIncomingEdge;
    });

    // If more than one node has no incoming connections, it's an error
    if (nodesWithoutTargets.length > 1) {
      return 'Cannot save flow: More than one node has empty target handles. Each node should be connected except for the starting node.';
    }

    return null;
  };

  /**
   * Handle save button click
   * Validates flow and shows appropriate feedback
   */
  const handleSave = () => {
    const error = validateFlow();
    console.log('error', error);
    if (error) {
      setSaveError(error);
      setTimeout(() => setSaveError(''), 5000); // Clear error after 5 seconds
    } else {
      setSaveError('');
      alert('Flow saved successfully!');
    }
  };

  /**
   * Toggle nodes panel visibility
   */
  const toggleNodesPanel = () => {
    if (showPanel && activePanel === 'nodes') {
      setShowPanel(false);
    } else {
      setActivePanel('nodes');
      setShowPanel(true);
      setSelectedNode(null);
    }
  };

  /**
   * Close panel
   */
  const closePanel = () => {
    setShowPanel(false);
    setSelectedNode(null);
  };

  return (
    <div className="app">
      {/* Header with save button and error display */}
      <header className="app-header">
        <div />
        {saveError && (
          <div className="save-error">
            Cannot save Flow
          </div>
        )}
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </header>

      <div className="flow-content-wrapper">
        <div className="flow-container">
          <FlowBuilder
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeUpdate={onNodeUpdate}
            onPaneClick={onPaneClick}
          />
        </div>

        {/* Sidebar panel */}
        <div className="sidebar">
          {showPanel ? (
            activePanel === 'nodes' ? (
              <NodesPanel onClose={closePanel} />
            ) : (
              <SettingsPanel
                selectedNode={selectedNode}
                onNodeUpdate={onNodeUpdate}
                onClose={closePanel}
              />
            )
          ) : (
            <button className="nodes-panel-trigger" onClick={toggleNodesPanel}>
              <BiMessageRoundedDetail color="#6d7ba5" size={20} />
              <span className="trigger-label">Message</span>
            </button>
          )}
        </div>


      </div>
    </div>
  );
}

export default App;