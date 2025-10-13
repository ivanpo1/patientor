import {useState} from "react";
import {Box, Button, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {EntryWithoutId, HealthCheckRating} from "../../types.ts";

interface Props {
    onSubmit: (values: EntryWithoutId) => void;
}

const EntryForm = ({onSubmit}: Props) => {
    const [description, setDescription] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [specialist, setSpecialist] = useState<string>('')
    const [diagnosisCodes, setDiagnosisCodes] = useState([''])

    const [type, setType] = useState<EntryWithoutId['type']>('OccupationalHealthcare')

    const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy)
    const [employerName, setEmployerName] = useState('')
    const [sickLeave, setSickLeave] = useState({startDate: '', endDate: ''})
    const [discharge, setDischarge] = useState({date: '', criteria: ''})

    const addEntry = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({type: 'HealthCheck', description, date, specialist, healthCheckRating, diagnosisCodes})
    }

    const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();
        setHealthCheckRating(Number(event.target.value))
    }

    const healthCheckOptions = Object.entries(HealthCheckRating)
        .filter(([key, _value]) => isNaN(Number(key)))
        .map(([label, value]) => ({
            label,
            value,
        }));


    return (
        <div>
            <Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
                <form onSubmit={addEntry}>

                    <Box component="section" sx={{p: 2, border: '2px dashed grey' }}
                         style={{marginTop: 8, marginBottom: 12}}
                    >
                        <InputLabel style={{marginBottom: 12}}>Entry Type</InputLabel>
                        <Select
                            fullWidth
                            value={type}
                            onChange={(event) => setType(event.target.value as EntryWithoutId['type'])}
                        >
                            <MenuItem value="HealthCheck">Health Check</MenuItem>
                            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                            <MenuItem value="Hospital">Hospital</MenuItem>
                        </Select>
                    </Box>

                    <TextField
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={({target}) => setDescription(target.value)}
                        style={{marginBottom: 12 }}
                    />

                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        value={date}
                        onChange={({target}) => setDate(target.value)}
                        InputLabelProps={{shrink: true}}
                        style={{marginBottom: 8}}
                    />

                    <TextField
                        label="Specialist"
                        placeholder="Dr. Emmet Brown"
                        fullWidth
                        value={specialist}
                        onChange={({target}) => setSpecialist(target.value)}
                        style={{marginBottom: 12}}
                    />

                    <TextField
                        label="Diagnosis Codes"
                        placeholder="Z57.1"
                        fullWidth
                        value={diagnosisCodes}
                        onChange={({target}) => setDiagnosisCodes([target.value])}
                        style={{marginBottom: 8}}
                    />

                    {type && type === 'HealthCheck' &&
                        (
                            <>
                                <InputLabel style={{ marginTop: 8 }}>HealthCheck Rating</InputLabel>
                                <Select style={{ marginBottom: 12 }}
                                    fullWidth
                                    value={healthCheckRating.toString()}
                                    onChange={onHealthCheckRatingChange}
                                >
                                    {healthCheckOptions.map(option =>
                                        <MenuItem
                                            key={option.label}
                                            value={option.value.toString()}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    )}
                                </Select>
                            </>
                        )
                    }


                    {type && type === 'Hospital' &&
                        (
                            <>
                                <TextField
                                    label="Discharge Date"
                                    type="date"
                                    fullWidth
                                    value={discharge.date}
                                    onChange={({target}) => setDischarge({...discharge, date: target.value})}
                                    InputLabelProps={{shrink: true}}
                                    style={{marginTop: 8, marginBottom: 8}}
                                />
                                <TextField
                                    label="Criteria"
                                    fullWidth
                                    value={discharge.criteria}
                                    onChange={({target}) => setDischarge({...discharge, criteria: target.value})}
                                    style={{marginBottom: 12}}
                                />
                            </>
                        )}

                    {type && type === 'OccupationalHealthcare' &&
                        (
                            <>
                                <TextField
                                    label="Employer Name"
                                    placeholder="Don Canelones Pastas & Coding on the Go"
                                    fullWidth
                                    value={employerName}
                                    onChange={({target}) => setEmployerName(target.value)}
                                    style={{marginBottom: 8}}
                                />

                                <InputLabel
                                    style={{marginBottom: 12}}>
                                    Sick Leave</InputLabel>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    value={sickLeave.startDate}
                                    onChange={({target}) => setSickLeave({...sickLeave, startDate: target.value})}
                                    inputProps={{
                                        max: sickLeave.endDate || undefined
                                    }}
                                    InputLabelProps={{shrink: true}}
                                    style={{marginBottom: 12}}
                                />

                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    value={sickLeave.endDate}
                                    onChange={({target}) => setSickLeave({...sickLeave, endDate: target.value})}
                                    inputProps={{
                                        min: sickLeave.startDate
                                    }}
                                    InputLabelProps={{shrink: true}}
                                    style={{marginBottom: 8}}
                                />
                            </>
                        )}


                    <Grid>
                        <Grid item>
                            <Button
                                color="secondary"
                                variant="contained"
                                type="button"
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </form>


            </Box>
        </div>
    )
}

export default EntryForm;