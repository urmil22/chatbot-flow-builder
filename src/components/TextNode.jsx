import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoLogoWhatsapp } from "react-icons/io";
import { Handle, Position } from 'reactflow';

/**
 * Text Node Component
 * Represents a message node in the chatbot flow
 * Features:
 * - Source handle (bottom) - can have only one outgoing connection
 * - Target handle (top) - can have multiple incoming connections
 * - Displays message text content
 */
const TextNode = ({ data, selected }) => {
    return (
        <div className={`text-node ${selected ? 'selected' : ''}`}>
            {/* Target handle - allows multiple incoming connections */}
            <Handle
                type="target"
                position={Position.Left}
                className="handle"
                isConnectable={true}
            />

            <div className="node-header">
                <BiMessageRoundedDetail size={12} />

                <span className="node-title">Send Message</span>

                <div className="whatsapp-icon-container">
                    <IoLogoWhatsapp color="green" size={12} />
                </div>
            </div>

            <div className="node-content">
                {data.label || 'Enter your message here...'}
            </div>

            {/* Source handle - allows only one outgoing connection */}
            <Handle
                type="source"
                position={Position.Right}
                className="handle"
                isConnectable={true}
            />
        </div >
    );
};

export default TextNode;