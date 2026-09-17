import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';

function CostlyAdmonition(props) {
    return (
        <div className="admonition alert alert--warning">
            <div className="admonition-heading">
                <h5>{props.title ?? 'This costs money'}</h5>
            </div>
            <div className="admonition-content">{props.children}</div>
        </div>
    );
}

export default {
    ...DefaultAdmonitionTypes,
    costly: CostlyAdmonition,
};