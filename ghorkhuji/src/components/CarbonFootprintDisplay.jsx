import { useEffect, useRef } from 'react';
import { useCarbonFootprint } from 'react-carbon-footprint';
import { getUser } from '../utils/auth';

const CarbonFootprintDisplay = () => {
    const [gCO2, bytesTransferred] = useCarbonFootprint();
    const timeoutRef = useRef(null);
    const lastSentRef = useRef({ bytes: 0, co2: 0 });

    useEffect(() => {
        // Only trigger if we have data
        const currentBytes = bytesTransferred || 0;
        const currentCo2 = gCO2 || 0;
        
        // Prevent sending identical data
        if (currentBytes === lastSentRef.current.bytes) return;

        // Clear existing timeout to debounce requests
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const user = getUser();
            const payload = {
                userId: user ? user._id : null,
                bytesTransferred: currentBytes,
                co2Emissions: currentCo2
            };

            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            fetch(`${backendUrl}/api/carbon-log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(() => {
                lastSentRef.current = { bytes: currentBytes, co2: currentCo2 };
            }).catch((err) => console.error("Failed to sync carbon footprint", err));
        }, 10000); // 10 seconds debounce to avoid excessive requests

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [bytesTransferred, gCO2]);

    // Return null to ensure no UI is rendered
    return null;
}

export default CarbonFootprintDisplay;
