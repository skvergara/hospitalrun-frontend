import { Modal, Alert } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import MedicalRecord from '../../shared/model/MedicalRecord'
import { RootState } from '../../shared/store'
import { addMedicalRecord } from '../patient-slice'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const AddMedicalRecordModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { medicalRecordError, patient } = useSelector((state: RootState) => state.patient)
  const { t } = useTranslator()

  const [medicalRecord, setMedicalRecord] = useState({ name: '', medicalRecordDate: new Date().toISOString(), aperture: '' })

  useEffect(() => {
    setMedicalRecord({ name: '', medicalRecordDate: new Date().toISOString(), aperture: '' })
  }, [show])

  const onSaveButtonClick = () => {
    dispatch(addMedicalRecord(patient.id, medicalRecord as MedicalRecord))
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setMedicalRecord((prevMedicalRecord) => ({ ...prevMedicalRecord, name }))
  }

  const onMedicalRecordDateChange = (medicalRecordDate: Date) => {
    if (medicalRecordDate) {
      setMedicalRecord((prevMedicalRecord) => ({
        ...prevMedicalRecord,
        medicalRecordDate: medicalRecordDate.toISOString(),
      }))
    }
  }

  const onApertureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const aperture = event.target.value
    setMedicalRecord((prevMedicalRecord) => ({ ...prevMedicalRecord, aperture }))
  }

  const body = (
    <>
      <form>
        {medicalRecordError && (
          <Alert
            color="danger"
            title={t('states.error')}
            message={t(medicalRecordError?.message || '')}
          />
        )}
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="name"
                label={t('patient.medicalrecords.medicalRecordName')}
                isEditable
                placeholder={t('patient.medicalrecords.medicalRecordName')}
                value={medicalRecord.name}
                onChange={onNameChange}
                isRequired
                feedback={t(medicalRecordError?.name || '')}
                isInvalid={!!medicalRecordError?.name}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="name"
                label={t('patient.medicalrecords.medicalRecordAperture')}
                isEditable
                placeholder={t('patient.medicalrecords.medicalRecordAperture')}
                value={medicalRecord.aperture}
                onChange={onApertureChange}
                isRequired
                feedback={t(medicalRecordError?.name || '')}
                isInvalid={!!medicalRecordError?.name}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <DatePickerWithLabelFormGroup
              name="medicalRecordDate"
              label={t('patient.medicalrecords.medicalRecordDate')}
              value={new Date(medicalRecord.medicalRecordDate)}
              isEditable
              onChange={onMedicalRecordDateChange}
              isRequired
              feedback={t(medicalRecordError?.date || '')}
              isInvalid={!!medicalRecordError?.date}
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

export default AddMedicalRecordModal
