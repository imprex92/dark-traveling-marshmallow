import React, { useEffect } from "react";
import { toImperial } from "components/utility/UnitConverter";

const MainTemp = ({ isMetric, fallback, main }) => {
    useEffect(() => {
    
    }, []);

    return (
        <div className="main-temp">
            <span>
                {isMetric ? main?.temp?.toFixed(1) : !isMetric && toImperial(main?.temp?.toFixed(1), 'degrees') ? toImperial(main?.temp?.toFixed(1), 'degrees') : fallback}
            </span>
            <span>
                {isMetric ? '°C' : '°F'}
            </span>
        </div>
    );
}

export default MainTemp;