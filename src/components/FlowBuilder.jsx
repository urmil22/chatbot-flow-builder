import { useCallback, useRef, useState } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { DEFAULT_NODE_POSITION, getNodeId } from '../constants';
import TextNode from './TextNode';

/**
 * Flow Builder Component
 * Main component that handles the React Flow canvas
 * Manages nodes, edges, and drag-and-drop functionality
 */

// Define custom node types mapping
const nodeTypes = {
    textMessage: TextNode,
};

const FlowBuilder = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
}) => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    /**
     * Handle drag over event to allow dropping
     */
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * Handle drop event to create new nodes
     * Creates a new node at the drop position
     */
    const onDrop = useCallback((event) => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        // Check if the dropped element is a valid node type
        if (typeof type === 'undefined' || !type || !reactFlowBounds) {
            return;
        }

        // Calculate position relative to the React Flow canvas
        const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        }) || DEFAULT_NODE_POSITION;

        // Create new node based on type
        const newNode = {
            id: getNodeId(),
            type,
            position,
            data: {
                label: type === 'textMessage' ? 'New message' : 'New node',
                type: 'text',
            },
        };

        // Add the new node to the flow
        onNodesChange([{ type: 'add', item: newNode }]);
    }, [reactFlowInstance, onNodesChange]);

    /**
     * Handle connection validation
     * Ensures source handles can only have one outgoing edge
     */
    const isValidConnection = useCallback((connection) => {
        // Check if source handle already has a connection
        const sourceConnections = edges.filter(
            (edge) => edge.source === connection.source
        );

        // Allow connection if source doesn't have any existing connections
        return sourceConnections.length === 0;
    }, [edges]);

    return (
        <div className="flow-builder" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                isValidConnection={isValidConnection}
                fitView
            />
        </div>
    );
};

// Wrap with ReactFlowProvider for context
const FlowBuilderWithProvider = (props) => (
    <ReactFlowProvider>
        <FlowBuilder {...props} />
    </ReactFlowProvider>
);

export default FlowBuilderWithProvider;