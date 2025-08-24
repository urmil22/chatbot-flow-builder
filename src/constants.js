// Available node types - easily extensible for new node types
export const NODE_TYPES = [
    {
        id: 'textMessage',
        label: 'Message',
        type: 'textMessage',
        icon: '💬'
    }
    // Future node types can be added here:
    // {
    //   id: 'imageMessage',
    //   label: 'Image',
    //   type: 'imageMessage',
    //   icon: '🖼️'
    // },
    // {
    //   id: 'conditionalNode',
    //   label: 'Condition',
    //   type: 'conditionalNode',
    //   icon: '🔀'
    // }
];

// Initial node counter for unique node IDs
export let nodeId = 0;

// Function to get next unique node ID
export const getNodeId = () => `node_${++nodeId}`;

// Default node positions
export const DEFAULT_NODE_POSITION = { x: 250, y: 250 };