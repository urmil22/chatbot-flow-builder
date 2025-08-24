import { useState, useEffect } from 'react';
import { IoArrowBack } from "react-icons/io5";

/**
 * Settings Panel Component
 * Appears when a node is selected and allows editing node properties
 * Currently supports text editing for Text nodes
 * Designed to be extensible for different node types
 */

const SettingsPanel = ({
    selectedNode,
    onNodeUpdate,
    onClose,
}) => {
    const [textValue, setTextValue] = useState('');

    // Update local state when selected node changes
    useEffect(() => {
        if (selectedNode && selectedNode.data.type === 'text') {
            setTextValue((selectedNode.data).label || '');
        }
    }, [selectedNode]);

    /**
     * Handle text input change and update the node
     */
    const handleTextChange = (event) => {
        const newValue = event.target.value;
        setTextValue(newValue);

        if (selectedNode) {
            onNodeUpdate(selectedNode.id, { label: newValue });
        }
    };

    if (!selectedNode) {
        return (
            <div className="panel">
                <div className="panel-header">
                    <IoArrowBack color="gray" onClick={onClose} />
                    <h3>Settings</h3>
                </div>
                <div className="panel-content">
                    <p>Select a node to edit its settings</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel">
            <div className="panel-header">
                <IoArrowBack color="gray" onClick={onClose} />
                <h3>Message</h3>
            </div>

            <div className="panel-content">
                {selectedNode.data.type === 'text' && (
                    <div className="setting-group">
                        <label htmlFor="message-text" className="panel-content-label">Text</label>
                        <textarea
                            id="message-text"
                            className="text-input"
                            value={textValue}
                            onChange={handleTextChange}
                            placeholder="Enter your message here..."
                            rows={4}
                            maxLength={200}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;