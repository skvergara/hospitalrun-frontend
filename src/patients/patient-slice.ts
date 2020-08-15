import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isAfter, isBefore, parseISO } from 'date-fns'
import { isEmpty } from 'lodash'
import validator from 'validator'

import PatientRepository from '../shared/db/PatientRepository'
import Allergy from '../shared/model/Allergy'
import CarePlan from '../shared/model/CarePlan'
import Diagnosis from '../shared/model/Diagnosis'
import Note from '../shared/model/Note'
import MedicalRecord from '../shared/model/MedicalRecord'
import CloseAnamnesis from '../shared/model/CloseAnamnesis'
import Patient from '../shared/model/Patient'
import RelatedPerson from '../shared/model/RelatedPerson'
import { AppThunk } from '../shared/store'
import { uuid } from '../shared/util/uuid'
import { cleanupPatient } from './util/set-patient-helper'

interface PatientState {
  status: 'loading' | 'error' | 'completed'
  isUpdatedSuccessfully: boolean
  patient: Patient
  relatedPersons: Patient[]
  createError?: Error
  updateError?: Error
  allergyError?: AddAllergyError
  diagnosisError?: AddDiagnosisError
  noteError?: AddNoteError
  medicalRecordError?: AddMedicalRecordError
  closeAnamnesisError?: AddCloseAnamnesisError
  relatedPersonError?: AddRelatedPersonError
  carePlanError?: AddCarePlanError
}

interface Error {
  message?: string
  givenName?: string
  dateOfBirth?: string
  suffix?: string
  prefix?: string
  familyName?: string
  preferredLanguage?: string
  emails?: (string | undefined)[]
  phoneNumbers?: (string | undefined)[]
}

interface AddRelatedPersonError {
  message?: string
  relatedPerson?: string
  relationshipType?: string
}

interface AddAllergyError {
  message?: string
  name?: string
}

interface AddDiagnosisError {
  message?: string
  name?: string
  date?: string
}

interface AddMedicalRecordError {
  message?: string
  name?: string
  date?: string
}

interface AddCloseAnamnesisError {
  message?: string
  title?: string
  name?: string
  date?: string
  size?: string
}

interface AddNoteError {
  message?: string
  note?: string
}

interface AddCarePlanError {
  message?: string
  title?: string
  description?: string
  status?: string
  intent?: string
  startDate?: string
  endDate?: string
  note?: string
  condition?: string
}

const initialState: PatientState = {
  status: 'loading',
  isUpdatedSuccessfully: false,
  patient: {} as Patient,
  relatedPersons: [],
  createError: undefined,
  updateError: undefined,
  allergyError: undefined,
  diagnosisError: undefined,
  noteError: undefined,
  medicalRecordError: undefined,
  closeAnamnesisError: undefined,
  relatedPersonError: undefined,
  carePlanError: undefined,
}

function start(state: PatientState) {
  state.status = 'loading'
  state.createError = {}
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    fetchPatientStart: start,
    fetchPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.status = 'completed'
      state.patient = payload
    },
    createPatientStart: start,
    createPatientSuccess(state) {
      state.status = 'completed'
    },
    createPatientError(state, { payload }: PayloadAction<Error>) {
      state.status = 'error'
      state.createError = payload
    },
    updatePatientStart: start,
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.status = 'completed'
      state.patient = payload
    },
    updatePatientError(state, { payload }: PayloadAction<Error>) {
      state.status = 'error'
      state.updateError = payload
    },
    addAllergyError(state, { payload }: PayloadAction<AddAllergyError>) {
      state.status = 'error'
      state.allergyError = payload
    },
    addDiagnosisError(state, { payload }: PayloadAction<AddDiagnosisError>) {
      state.status = 'error'
      state.diagnosisError = payload
    },
    addRelatedPersonError(state, { payload }: PayloadAction<AddRelatedPersonError>) {
      state.status = 'error'
      state.relatedPersonError = payload
    },
    addNoteError(state, { payload }: PayloadAction<AddRelatedPersonError>) {
      state.status = 'error'
      state.noteError = payload
    },
    addMedicalRecordError(state, { payload }: PayloadAction<AddMedicalRecordError>) {
      state.status = 'error'
      state.medicalRecordError = payload
    },
    addCloseAnamnesisError(state, { payload }: PayloadAction<AddCloseAnamnesisError>) {
      state.status = 'error'
      state.closeAnamnesisError = payload
    },
    removeCloseAnamnesisError(state) {
      state.status = 'completed'
      state.closeAnamnesisError = undefined
    },
    addCarePlanError(state, { payload }: PayloadAction<AddRelatedPersonError>) {
      state.status = 'error'
      state.carePlanError = payload
    },
  },
})

export const {
  fetchPatientStart,
  fetchPatientSuccess,
  createPatientStart,
  createPatientSuccess,
  createPatientError,
  updatePatientStart,
  updatePatientSuccess,
  updatePatientError,
  addAllergyError,
  addDiagnosisError,
  addRelatedPersonError,
  addNoteError,
  addMedicalRecordError,
  addCloseAnamnesisError,
  removeCloseAnamnesisError,
  addCarePlanError,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchPatientStart())
  const patient = await PatientRepository.find(id)
  dispatch(fetchPatientSuccess(patient))
}

function validatePatient(patient: Patient) {
  const error: Error = {}

  const regexContainsNumber = /\d/

  if (!patient.givenName) {
    error.givenName = 'patient.errors.patientGivenNameFeedback'
  }

  if (patient.dateOfBirth) {
    const today = new Date(Date.now())
    const dob = parseISO(patient.dateOfBirth)
    if (isAfter(dob, today)) {
      error.dateOfBirth = 'patient.errors.patientDateOfBirthFeedback'
    }
  }

  if (patient.suffix) {
    if (regexContainsNumber.test(patient.suffix)) {
      error.suffix = 'patient.errors.patientNumInSuffixFeedback'
    }
  }

  if (patient.prefix) {
    if (regexContainsNumber.test(patient.prefix)) {
      error.prefix = 'patient.errors.patientNumInPrefixFeedback'
    }
  }

  if (patient.familyName) {
    if (regexContainsNumber.test(patient.familyName)) {
      error.familyName = 'patient.errors.patientNumInFamilyNameFeedback'
    }
  }

  if (patient.preferredLanguage) {
    if (regexContainsNumber.test(patient.preferredLanguage)) {
      error.preferredLanguage = 'patient.errors.patientNumInPreferredLanguageFeedback'
    }
  }

  if (patient.emails) {
    const errors: (string | undefined)[] = []
    patient.emails.forEach((email) => {
      if (!validator.isEmail(email.value)) {
        errors.push('patient.errors.invalidEmail')
      } else {
        errors.push(undefined)
      }
    })
    // Only add to error obj if there's an error
    if (errors.some((value) => value !== undefined)) {
      error.emails = errors
    }
  }

  if (patient.phoneNumbers) {
    const errors: (string | undefined)[] = []
    patient.phoneNumbers.forEach((phoneNumber) => {
      if (!validator.isMobilePhone(phoneNumber.value)) {
        errors.push('patient.errors.invalidPhoneNumber')
      } else {
        errors.push(undefined)
      }
    })
    // Only add to error obj if there's an error
    if (errors.some((value) => value !== undefined)) {
      error.phoneNumbers = errors
    }
  }

  return error
}

export const createPatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(createPatientStart())

  const cleanPatient = cleanupPatient(patient)
  const newPatientError = validatePatient(cleanPatient)

  if (isEmpty(newPatientError)) {
    const newPatient = await PatientRepository.save(cleanPatient)
    dispatch(createPatientSuccess())

    if (onSuccess) {
      onSuccess(newPatient)
    }
  } else {
    newPatientError.message = 'patient.errors.createPatientError'
    dispatch(createPatientError(newPatientError))
  }
}

export const updatePatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())

  const cleanPatient = cleanupPatient(patient)
  const updateError = validatePatient(cleanPatient)

  if (isEmpty(updateError)) {
    const updatedPatient = await PatientRepository.saveOrUpdate(cleanPatient)
    dispatch(updatePatientSuccess(updatedPatient))

    if (onSuccess) {
      onSuccess(updatedPatient)
    }
  } else {
    updateError.message = 'patient.errors.updatePatientError'
    dispatch(updatePatientError(updateError))
  }
}

function validateRelatedPerson(relatedPerson: RelatedPerson) {
  const error: AddRelatedPersonError = {}

  if (!relatedPerson.patientId) {
    error.relatedPerson = 'patient.relatedPersons.error.relatedPersonRequired'
  }

  if (!relatedPerson.type) {
    error.relationshipType = 'patient.relatedPersons.error.relationshipTypeRequired'
  }

  return error
}

export const addRelatedPerson = (
  patientId: string,
  relatedPerson: RelatedPerson,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newRelatedPersonError = validateRelatedPerson(relatedPerson)

  if (isEmpty(newRelatedPersonError)) {
    const patient = await PatientRepository.find(patientId)
    const relatedPersons = patient.relatedPersons || []
    relatedPersons.push({ id: uuid(), ...relatedPerson })
    patient.relatedPersons = relatedPersons

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newRelatedPersonError.message = 'patient.relatedPersons.error.unableToAddRelatedPerson'
    dispatch(addRelatedPersonError(newRelatedPersonError))
  }
}

export const removeRelatedPerson = (
  patientId: string,
  relatedPersonId: string,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const patient = await PatientRepository.find(patientId)
  patient.relatedPersons = patient.relatedPersons?.filter((r) => r.patientId !== relatedPersonId)

  await dispatch(updatePatient(patient, onSuccess))
}

function validateDiagnosis(diagnosis: Diagnosis) {
  const error: AddDiagnosisError = {}

  if (!diagnosis.name) {
    error.name = 'patient.diagnoses.error.nameRequired'
  }

  if (!diagnosis.diagnosisDate) {
    error.date = 'patient.diagnoses.error.dateRequired'
  }

  return error
}

export const addDiagnosis = (
  patientId: string,
  diagnosis: Diagnosis,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newDiagnosisError = validateDiagnosis(diagnosis)

  if (isEmpty(newDiagnosisError)) {
    const patient = await PatientRepository.find(patientId)
    const diagnoses = patient.diagnoses || []
    diagnoses.push({ id: uuid(), ...diagnosis })
    patient.diagnoses = diagnoses

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newDiagnosisError.message = 'patient.diagnoses.error.unableToAdd'
    dispatch(addDiagnosisError(newDiagnosisError))
  }
}

function validateMedicalRecord(medicalRecord: MedicalRecord) {
  const error: AddMedicalRecordError = {}

  if (!medicalRecord.name) {
    error.name = 'patient.medicalrecords.error.nameRequired'
  }

  if (!medicalRecord.medicalRecordDate) {
    error.date = 'patient.medicalrecords.error.dateRequired' 
  }

  return error
}

export const addMedicalRecord = (
  patientId: string,
  medicalRecord: MedicalRecord,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newMedicalRecordError = validateMedicalRecord(medicalRecord)

  if (isEmpty(newMedicalRecordError)) {
    const patient = await PatientRepository.find(patientId)
    const medicalRecords = patient.medicalRecords || []
    medicalRecords.push({ id: uuid(), ...medicalRecord })
    patient.medicalRecords = medicalRecords

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newMedicalRecordError.message = 'patient.medicalrecords.error.unableToAdd'
    dispatch(addMedicalRecordError(newMedicalRecordError))
  }
}

function validateCloseAnamnesis(closeAnamnesis: CloseAnamnesis) {
  const error: AddCloseAnamnesisError = {}

  if (!closeAnamnesis.title) {
    error.title = 'patient.closeAnamneses.error.titleRequired'
  }
  
  if (!closeAnamnesis.name) {
    error.name = 'patient.closeAnamneses.error.nameRequired'
  }

  if (!closeAnamnesis.closeAnamnesisDate) {
    error.date = 'patient.closeAnamneses.error.dateRequired' 
  }

  if (!closeAnamnesis.size) {
    error.size = 'patient.closeAnamneses.error.sizeRequired' 
  }

  return error
}

export const addCloseAnamnesis = (
  patientId: string,
  closeAnamnesis: CloseAnamnesis,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newCloseAnamnesisError = validateCloseAnamnesis(closeAnamnesis)

  if (isEmpty(newCloseAnamnesisError)) {
    const patient = await PatientRepository.find(patientId)
    const closeAnamneses = patient.closeAnamneses || []
    closeAnamneses.push({ id: uuid(), ...closeAnamnesis })
    patient.closeAnamneses = closeAnamneses

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newCloseAnamnesisError.message = 'patient.closeAnamneses.error.unableToAdd'
    dispatch(addCloseAnamnesisError(newCloseAnamnesisError))
  }
}

export const updateCloseAnamnesis = (
  patient: Patient,
  closeAnamnesis: CloseAnamnesis,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newCloseAnamnesisError = validateCloseAnamnesis(closeAnamnesis)

  if (isEmpty(newCloseAnamnesisError)) {
    /*const patient = await PatientRepository.find(patientId)
    const closeAnamneses = patient.closeAnamneses || []
    closeAnamneses.push({ id: uuid(), ...closeAnamnesis })
    patient.closeAnamneses = closeAnamneses*/

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newCloseAnamnesisError.message = 'patient.closeAnamneses.error.unableToAdd'
    dispatch(addCloseAnamnesisError(newCloseAnamnesisError))
  }
}

function validateAllergy(allergy: Allergy) {
  const error: AddAllergyError = {}

  if (!allergy.name) {
    error.name = 'patient.allergies.error.nameRequired'
  }

  return error
}

export const addAllergy = (
  patientId: string,
  allergy: Allergy,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newAllergyError = validateAllergy(allergy)

  if (isEmpty(newAllergyError)) {
    const patient = await PatientRepository.find(patientId)
    const allergies = patient.allergies || []
    allergies.push({ id: uuid(), ...allergy })
    patient.allergies = allergies

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newAllergyError.message = 'patient.allergies.error.unableToAdd'
    dispatch(addAllergyError(newAllergyError))
  }
}

function validateNote(note: Note) {
  const error: AddNoteError = {}
  if (!note.text) {
    error.message = 'patient.notes.error.noteRequired'
  }

  return error
}

export const addNote = (
  patientId: string,
  note: Note,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newNoteError = validateNote(note)

  if (isEmpty(newNoteError)) {
    const patient = await PatientRepository.find(patientId)
    const notes = patient.notes || []
    notes.push({ id: uuid(), date: new Date().toISOString(), ...note })
    patient.notes = notes

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newNoteError.message = 'patient.notes.error.unableToAdd'
    dispatch(addNoteError(newNoteError))
  }
}

function validateCarePlan(carePlan: CarePlan): AddCarePlanError {
  const error: AddCarePlanError = {}

  if (!carePlan.title) {
    error.title = 'patient.carePlan.error.titleRequired'
  }

  if (!carePlan.description) {
    error.description = 'patient.carePlan.error.descriptionRequired'
  }

  if (!carePlan.status) {
    error.status = 'patient.carePlan.error.statusRequired'
  }

  if (!carePlan.intent) {
    error.intent = 'patient.carePlan.error.intentRequired'
  }

  if (!carePlan.startDate) {
    error.startDate = 'patient.carePlan.error.startDateRequired'
  }

  if (!carePlan.endDate) {
    error.endDate = 'patient.carePlan.error.endDateRequired'
  }

  if (carePlan.startDate && carePlan.endDate) {
    if (isBefore(new Date(carePlan.endDate), new Date(carePlan.startDate))) {
      error.endDate = 'patient.carePlan.error.endDateMustBeAfterStartDate'
    }
  }

  if (!carePlan.diagnosisId) {
    error.condition = 'patient.carePlan.error.conditionRequired'
  }

  return error
}

export const addCarePlan = (
  patientId: string,
  carePlan: CarePlan,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const carePlanError = validateCarePlan(carePlan)
  if (isEmpty(carePlanError)) {
    const patient = await PatientRepository.find(patientId)
    const carePlans = patient.carePlans || ([] as CarePlan[])
    carePlans.push({
      id: uuid(),
      createdOn: new Date(Date.now().valueOf()).toISOString(),
      ...carePlan,
    })
    patient.carePlans = carePlans

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    carePlanError.message = 'patient.carePlan.error.unableToAdd'
    dispatch(addCarePlanError(carePlanError))
  }
}

export default patientSlice.reducer
export type { AddCloseAnamnesisError }
