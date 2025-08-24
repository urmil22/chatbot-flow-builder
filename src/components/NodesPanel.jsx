import { IoArrowBack } from "react-icons/io5";
import { NODE_TYPES } from '../constants';

/**
 * Nodes Panel Component
 * Houses all available node types that can be added to the flow
 * Supports drag and drop functionality to add nodes to the flow
 * Designed to be easily extensible for new node types
 */

const NodesPanel = ({ onClose }) => {
    /**
     * Handle drag start event
     * Sets the node type data for the drag operation
     */
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <IoArrowBack color="gray" onClick={onClose} />
                <h4>Nodes Panel</h4>
            </div>

            <div className="panel-content">
                <div className="node-types-grid">
                    {NODE_TYPES.map((nodeType) => (
                        <div
                            key={nodeType.id}
                            className="node-type-item"
                            draggable
                            onDragStart={(event) => onDragStart(event, nodeType.type)}
                        >
                            <div className="node-type-icon">{nodeType.icon}</div>
                            <div className="node-type-label">{nodeType.label}</div>
                        </div>
                    ))}
                    <div className="panel-note">
                        <p>Drag and drop nodes to add them to your flow</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NodesPanel;