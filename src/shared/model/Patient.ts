import AbstractDBModel from './AbstractDBModel'
import Allergy from './Allergy'
import CarePlan from './CarePlan'
import ContactInformation from './ContactInformation'
import Diagnosis from './Diagnosis'
import Name from './Name'
import Note from './Note'
import MedicalRecord from './MedicalRecord'
import CloseAnamnesis from './CloseAnamnesis'
import RelatedPerson from './RelatedPerson'

export default interface Patient extends AbstractDBModel, Name, ContactInformation {
  sex: string
  dateOfBirth: string
  isApproximateDateOfBirth: boolean
  preferredLanguage?: string
  occupation?: string
  type?: string
  code: string
  relatedPersons?: RelatedPerson[]
  allergies?: Allergy[]
  diagnoses?: Diagnosis[]
  notes?: Note[]
  medicalRecords?: MedicalRecord[]
  closeAnamneses?: CloseAnamnesis[]
  index: string
  carePlans: CarePlan[]
  bloodType: string
}
