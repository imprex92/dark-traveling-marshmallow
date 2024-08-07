import React from 'react'
import PropTypes from 'prop-types'

const Tooltip = ({ text, children, position = 'top' }) => {
    return (
        <>
            <div className={'tooltipContainer'}>
                {children}
                <span className={`tooltipText ${position}`}>{text}</span>
            </div>
            <style scoped="true" jsx>{`
                .tooltipContainer {
                    position: relative;
                    display: inline-block;
                    height: fit-content;
                }

                .tooltipText {
                    visibility: hidden;
                    width: 120px;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px 0;
                    position: absolute;
                    z-index: 1;
                    opacity: 0;
                    transition: opacity 0.5s;
                }

                .tooltipContainer:hover .tooltipText {
                    visibility: visible;
                    opacity: 1;
                }

                .top {
                    bottom: 100%;
                    left: 50%;
                    margin-left: -60px;
                }

                .right {
                    top: 50%;
                    left: 100%;
                    margin-top: -16px;
                    margin-left: 8px;
                }

                .bottom {
                    top: 100%;
                    left: 50%;
                    margin-left: -60px;
                }

                .left {
                    top: 50%;
                    right: 100%;
                    margin-top: -16px;
                    margin-right: 8px;
                }
            `}</style>
        </>
    )
}

Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

Tooltip.defaultProps = {
    position: 'top',
};

export default Tooltip