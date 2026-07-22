import './button.css'
type ButtonProps = {
    content: String;
    onClick: () => void;
}
function Button({ content, onClick }: ButtonProps) {
    return (
        <button className="common-button" type="button" onClick={onClick}>
            {content}
        </button>
    )
}

export default Button;