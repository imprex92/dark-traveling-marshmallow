import React, { useEffect } from "react";
import { toImperial } from "components/utility/UnitConverter";

const MainTemp = ({ isMetric, fallback, main, error }) => {

    return (
        <div className="main-temp">
            <span>
                {!error && isMetric ? main?.temp?.toFixed(1) : !error && !isMetric && toImperial(main?.temp?.toFixed(1), 'degrees') ? toImperial(main?.temp?.toFixed(1), 'degrees') : fallback}
            </span>
            <span>
                {isMetric ? '°C' : '°F'}
            </span>
        </div>
    );
}

export default MainTemp;