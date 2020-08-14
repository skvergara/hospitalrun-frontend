import { Modal, Alert, Toast } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import CloseAnamnesis from '../../shared/model/CloseAnamnesis'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import { updatePatient } from '../patient-slice'

interface Props {
  editCloseAnamnesis: CloseAnamnesis
  index: number
  show: boolean
  onCloseButtonClick: () => void
}

const EditCloseAnamnesisModal = (props: Props) => {
  const { editCloseAnamnesis, index, show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { closeAnamnesisError, patient: reduxPatient } = useSelector((state: RootState) => state.patient)
  const { t } = useTranslator()
  const history = useHistory()

  const [closeAnamnesis, setCloseAnamnesis] = useState({
    name: editCloseAnamnesis.name,
    closeAnamnesisDate: editCloseAnamnesis.closeAnamnesisDate,
    description: editCloseAnamnesis.description    
  })

  useEffect(() => {
    setCloseAnamnesis({
      name: editCloseAnamnesis.name,
      closeAnamnesisDate: editCloseAnamnesis.closeAnamnesisDate,
      description: editCloseAnamnesis.description 
    }) // eslint-disable-next-line
  }, [show])

  const [patient, setPatient] = useState({} as Patient)

  useEffect(() => {
    setPatient(reduxPatient)
  }, [reduxPatient])

  const onPatientChange = (newPatient: Partial<Patient>) => {
    setPatient(newPatient as Patient)
  }

  const data = (patient.closeAnamneses as CloseAnamnesis[])

  const onFieldChange = (name: string, value: string | boolean | CloseAnamnesis[]) => {
    //if (onChange) {
      const newPatient = {
        ...patient,
        [name]: value,
      }
      onPatientChange(newPatient)
    //}
  }

  const onValueChange = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    //if (onChange) {
      const newValue = event.currentTarget.value 
      setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, [name]: newValue }))

      const currentCloseAnamnesis = { ...data[index], [name]: newValue }
      const newCloseAnamneses = [...data]
      newCloseAnamneses.splice(index, 1, currentCloseAnamnesis)
      onFieldChange('closeAnamneses', newCloseAnamneses)
    //}
  }

  const onCloseAnamnesisDateChange = (closeAnamnesisDateInput: Date, index: number) => {
    if (closeAnamnesisDateInput) {
      setCloseAnamnesis((prevCloseAnamnesis) => ({
        ...prevCloseAnamnesis,
        closeAnamnesisDate: closeAnamnesisDateInput.toISOString(),
      }))
    }
    
    const currentCloseAnamnesis = { ...data[index], closeAnamnesisDate: closeAnamnesisDateInput.toISOString() } //hay que usar el key del Objeto: e.g. name y no value
    const newCloseAnamneses = [...data]
    newCloseAnamneses.splice(index, 1, currentCloseAnamnesis)
    onFieldChange('closeAnamneses', newCloseAnamneses)
  }

  const onSuccessfulSave = (updatedPatient: Patient) => {
    history.push(`/patients/${updatedPatient.id}/closeanamneses`)
    Toast(
      'success',
      t('states.success'),
      `${t('patients.successfullyUpdated')} ${patient.fullName}`,
    )
  }

  const onSave = async () => {
    await dispatch(updatePatient(patient, onSuccessfulSave))
  }

  const onSaveButtonClick = () => {
    onSave()
  }

  const onCancel = () => {
    setPatient(reduxPatient)
    onCloseButtonClick()
  }

  const body = (
    <>
      <form>
        {closeAnamnesisError && (
          <Alert
            color="danger"
            title={t('states.error')}
            message={t(closeAnamnesisError?.message || '')}
          />
        )}
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="name"
                //label={t('patient.medicalrecords.closeAnamnesisName')}
                label={'labale name'}
                isEditable
                //placeholder={t('patient.medicalrecords.closeAnamnesisName')}
                placeholder={'ph name'}
                value={closeAnamnesis.name}
                //onChange={onNameChange}
                onChange={(event: any) => onValueChange('name', event, index)}
                isRequired
                feedback={t(closeAnamnesisError?.name || '')}
                isInvalid={!!closeAnamnesisError?.name}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="name"
                //label={t('patient.medicalrecords.closeAnamnesisAperture')}
                label={'label description'}
                isEditable
                //placeholder={t('patient.medicalrecords.closeAnamnesisAperture')}
                placeholder={'ph description'}
                value={closeAnamnesis.description}
                onChange={(event: any) => onValueChange('description', event, index)}
                isRequired
                feedback={t(closeAnamnesisError?.name || '')}
                isInvalid={!!closeAnamnesisError?.name}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <DatePickerWithLabelFormGroup
              name="closeAnamnesisDate"
              //label={t('patient.medicalrecords.closeAnamnesisDate')}
              label={'labael date'}
              value={new Date(closeAnamnesis.closeAnamnesisDate)}
              isEditable
              onChange={(date: Date) => onCloseAnamnesisDateChange(date, index)}
              isRequired
              feedback={t(closeAnamnesisError?.date || '')}
              isInvalid={!!closeAnamnesisError?.date}
            />
          </div>
        </div>
      </form>
    </>
  )
  return (
    <Modal
      show={show}
      toggle={onCancel}
      //title={t('patient.medicalrecords.new')}
      title={'Edit Close Anamnesis'}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        //onClick: onCloseButtonClick,
        onClick: onCancel,
      }}
      successButton={{
        children: t('patient.medicalrecords.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default EditCloseAnamnesisModal
