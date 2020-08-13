import { Modal, Alert } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import CloseAnamnesis from '../../shared/model/CloseAnamnesis'
import { RootState } from '../../shared/store'
import { addCloseAnamnesis } from '../patient-slice'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const AddCloseAnamnesisModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { closeAnamnesisError, patient } = useSelector((state: RootState) => state.patient)
  const { t } = useTranslator()

  const [closeAnamnesis, setCloseAnamnesis] = useState({ name: '', closeAnamnesisDate: new Date().toISOString(), description: '' })

  useEffect(() => {
    setCloseAnamnesis({ name: '', closeAnamnesisDate: new Date().toISOString(), description: '' })
  }, [show])

  const onSaveButtonClick = () => {
    dispatch(addCloseAnamnesis(patient.id, closeAnamnesis as CloseAnamnesis))
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, name }))
  }

  const onCloseAnamnesisDateChange = (closeAnamnesisDate: Date) => {
    if (closeAnamnesisDate) {
      setCloseAnamnesis((prevCloseAnamnesis) => ({
        ...prevCloseAnamnesis,
        closeAnamnesisDate: closeAnamnesisDate.toISOString(),
      }))
    }
  }

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value
    setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, description }))
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
                onChange={onNameChange}
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
                onChange={onDescriptionChange}
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
              onChange={onCloseAnamnesisDateChange}
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
      toggle={onCloseButtonClick}
      title={t('patient.medicalrecords.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
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

export default AddCloseAnamnesisModal
