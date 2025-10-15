import axios from "axios";
import { EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
    const { data } = await axios.get<Patient[]>(
        `${ apiBaseUrl }/patients`
    );

    return data;
};

const getPatientById = async ( id: string | undefined ): Promise<Patient | undefined> => {
    const { data } = await axios.get<Patient>(
        `${ apiBaseUrl }/patients/${ id }`
    );
    return data;
};

const createPatientEntry = async ( id: string | undefined, object: EntryWithoutId ) : Promise<Patient> => {
    if (!id) {
        throw new Error('Patient ID is required');
    }

    const { data } = await axios.post<Patient>(`${ apiBaseUrl }/patients/${ id }/entries`, object);
    return data;
};

const create = async ( object: PatientFormValues ) => {
    const { data } = await axios.post<Patient>(
        `${ apiBaseUrl }/patients`,
        object
    );

    return data;
};

export default {
    getAll, create, getPatientById, createPatientEntry
};

