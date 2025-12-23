import { Box, Slider } from "@mui/material"
import { useCallback } from "react";

interface CountryAlliancesFiltersProps {
    minAllies: number;
    maxAllies: number;
    onAlliesRangeChange: (min: number, max: number) => void;
}

export const CountryAlliancesFilters = ({ minAllies, maxAllies, onAlliesRangeChange }: CountryAlliancesFiltersProps) => {

    const handleChange = useCallback((_: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            onAlliesRangeChange(newValue[0], newValue[1]);
        }
    }, []);

    return (
        <Box sx={{ width: 300, marginBottom: 4 }}>
            <Slider
                getAriaLabel={() => 'Number of allies range'}
                value={[minAllies, maxAllies]}
                onChange={handleChange}
                valueLabelDisplay="auto"
            />
        </Box>);
}