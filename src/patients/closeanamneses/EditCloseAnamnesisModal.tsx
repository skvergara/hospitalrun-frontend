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
import { /*updatePatient,*/ updateCloseAnamnesis } from '../patient-slice'
import CloseAnamnesisLayout from './CloseAnamnesisLayout'

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
    //id: editCloseAnamnesis.id,
    title: editCloseAnamnesis.title, 
    name: editCloseAnamnesis.name,
    closeAnamnesisDate: editCloseAnamnesis.closeAnamnesisDate,
    size: editCloseAnamnesis.size    
  })

  useEffect(() => {
    setCloseAnamnesis({
      //id: editCloseAnamnesis.id,
      title: editCloseAnamnesis.title, 
      name: editCloseAnamnesis.name,
      closeAnamnesisDate: editCloseAnamnesis.closeAnamnesisDate,
      size: editCloseAnamnesis.size 
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
      console.log('newValue: '+newValue) 
      setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, [name]: newValue }))

      const currentCloseAnamnesis = { ...data[index], [name]: newValue }
      const newCloseAnamneses = [...data]
      newCloseAnamneses.splice(index, 1, currentCloseAnamnesis)
      onFieldChange('closeAnamneses', newCloseAnamneses)
    //}
  }

  const onDateChange = (closeAnamnesisDateInput: Date, index: number) => {
    if (closeAnamnesisDateInput) {
      setCloseAnamnesis((prevCloseAnamnesis) => ({
        ...prevCloseAnamnesis,
        closeAnamnesisDate: closeAnamnesisDateInput.toISOString(),
      }))
    
      const currentCloseAnamnesis = { ...data[index], closeAnamnesisDate: closeAnamnesisDateInput.toISOString() } //hay que usar el key del Objeto: e.g. name y no value
      const newCloseAnamneses = [...data]
      newCloseAnamneses.splice(index, 1, currentCloseAnamnesis)
      onFieldChange('closeAnamneses', newCloseAnamneses)
    }
  }

  const onSuccessfulSave = (updatedPatient: Patient) => {
    history.push(`/patients/${updatedPatient.id}/closeanamneses`)
    Toast(
      'success',
      t('states.success'),
      `${t('patient.closeAnamneses.successfullyUpdated')}`,
    )
  }

  const onSave = async () => {
    await dispatch(updateCloseAnamnesis(patient, closeAnamnesis as CloseAnamnesis, onSuccessfulSave))
  }

  const onSaveButtonClick = () => {
    onSave()
  }

  const onCancel = () => {
    setPatient(reduxPatient)
    onCloseButtonClick()
  }

  const body = <CloseAnamnesisLayout
    closeAnamnesis={closeAnamnesis}
    closeAnamnesisError={closeAnamnesisError} 
    onChange={(name: string, event: React.ChangeEvent<HTMLInputElement>) => onValueChange(name, event, index)}
    onDateChange={(date: Date) => onDateChange(date, index)}
    isEditable={true}
    isRequired={true}
  />

  //body0 es el antiguo metodo, concentrado en body y CloseAnamnesisLayout... dejar como referencia mientras
  const body0 = (
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
                label={t('patient.closeAnamneses.closeAnamnesisName')}
                isEditable
                placeholder={t('patient.closeAnamneses.closeAnamnesisName')}
                value={closeAnamnesis.name}
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
                label={t('patient.closeAnamneses.closeAnamnesisSize')}
                isEditable
                placeholder={t('patient.closeAnamneses.closeAnamnesisSize')}
                value={closeAnamnesis.size}
                onChange={(event: any) => onValueChange('size', event, index)}
                isRequired
                feedback={t(closeAnamnesisError?.size || '')}
                isInvalid={!!closeAnamnesisError?.size}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <DatePickerWithLabelFormGroup
              name="closeAnamnesisDate"
              label={t('patient.closeAnamneses.closeAnamnesisDate')}
              value={new Date(closeAnamnesis.closeAnamnesisDate)}
              isEditable
              onChange={(date: Date) => onDateChange(date, index)}
              isRequired
              feedback={t(closeAnamnesisError?.date || '')}
              isInvalid={!!closeAnamnesisError?.date}
            />
          </div>
        </div>
      </form>
    </>
  )
  console.log(body0)
  return (
    <Modal
      show={show}
      toggle={onCancel}
      title={t('patient.closeAnamneses.edit')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        //onClick: onCloseButtonClick,
        onClick: onCancel,
      }}
      successButton={{
        children: t('patient.closeAnamneses.edit'),
        color: 'success',
        icon: 'edit',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default EditCloseAnamnesisModal
