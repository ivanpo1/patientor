import type { Diagnosis, Entry } from "../../types.ts";
import HealthCheck from "./HealthCheck.tsx";
import Hospital from "./Hospital.tsx";
import OccupationalHealthcare from "./OccupationalHealthcare.tsx";

const assertNever = ( value: never ): never => {
    throw new Error(
        `Unhandled discriminated union member: ${ JSON.stringify(value) }`
    );
};

export interface EntryBaseProps {
    entry: Entry;
    header?: string;
    diagnosis?: Diagnosis[]
}

const EntryDetails = ( { entry, diagnosis }: EntryBaseProps ) => {
    switch (entry.type) {
        case "HealthCheck":
            return (
                <HealthCheck entry={ entry } diagnosis={ diagnosis } header="Health Check"/>
            );
        case "Hospital":
            return (
                <Hospital entry={ entry } diagnosis={ diagnosis } header="Hospital"/>
            );
        case "OccupationalHealthcare":
            return (
                <OccupationalHealthcare entry={ entry } diagnosis={ diagnosis } header="Occupational Healthcare"/>
            );
        default:
            return assertNever(entry);
    }
};

export default EntryDetails;