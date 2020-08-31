import { Modal, Alert } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import CloseAnamnesis from '../../shared/model/CloseAnamnesis'
import { RootState } from '../../shared/store'
import { addCloseAnamnesis, removeCloseAnamnesisError } from '../patient-slice'
import CloseAnamnesisLayout from './CloseAnamnesisLayout'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const AddCloseAnamnesisModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { closeAnamnesisError, patient } = useSelector((state: RootState) => { console.log(state.patient); return state.patient })
  const { t } = useTranslator()

  const [closeAnamnesis, setCloseAnamnesis] = useState({ title: '', name: '', closeAnamnesisDate: new Date().toISOString(), size: '' })

  useEffect(() => {
    setCloseAnamnesis({ title: '', name: '', closeAnamnesisDate: new Date().toISOString(), size: '' })
  }, [show])

  const onSaveButtonSuccess = () => {
    dispatch(removeCloseAnamnesisError())
  }

  const onSaveButtonClick = () => {
    dispatch(addCloseAnamnesis(patient.id, closeAnamnesis as CloseAnamnesis, onSaveButtonSuccess))
  }

  const onValueChange = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    console.log('newValue: ' + newValue)
    setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, [name]: newValue }))
  }

  /*const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value
    console.log('newValue: '+name) 
    setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, name }))
  }

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.currentTarget.value
    setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, description }))
  }*/

  const onDateChange = (date: Date) => {
    if (date) {
      setCloseAnamnesis((prevCloseAnamnesis) => ({
        ...prevCloseAnamnesis,
        closeAnamnesisDate: date.toISOString(),
      }))
    }
  }

  const body = <CloseAnamnesisLayout
    closeAnamnesis={closeAnamnesis}
    closeAnamnesisError={closeAnamnesisError}
    onChange={(name: string, event: React.ChangeEvent<HTMLInputElement>) => onValueChange(name, event)}
    onDateChange={(date: Date) => onDateChange(date)}
    isEditable={true}
    isRequired={true}
  />

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
                onChange={(event) => onValueChange('name', event)}
                isRequired
                feedback={t(closeAnamnesisError?.name || '')} //mensaje de que campo es requerido
                isInvalid={!!closeAnamnesisError?.name} //muestra el mensaje
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="size"
                label={t('patient.closeAnamneses.closeAnamnesisSize')}
                isEditable
                placeholder={t('patient.closeAnamneses.closeAnamnesisSize')}
                value={closeAnamnesis.size}
                onChange={(event) => onValueChange('size', event)}
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
              onChange={onDateChange}
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
      toggle={onCloseButtonClick}
      title={t('patient.closeAnamneses.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: t('patient.closeAnamneses.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddCloseAnamnesisModal
