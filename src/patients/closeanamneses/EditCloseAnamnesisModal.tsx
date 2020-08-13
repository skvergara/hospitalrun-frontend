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
//import { addCloseAnamnesis } from '../patient-slice'
import { updatePatient/*, fetchPatient*/ } from '../patient-slice'

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
console.log('INDEX: '+index)
console.log(onCloseButtonClick)
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

  /*const { patient: reduxPatient, status, updateError } = useSelector(
    (state: RootState) => state.patient,
  )*/

  useEffect(() => {
    setPatient(reduxPatient)
  }, [reduxPatient])

  //const { id } = useParams()
  /*useEffect(() => {
    if (patient.id) {
      dispatch(fetchPatient(patient.id))
    }
  }, [patient.id, dispatch])*/

  const onPatientChange = (newPatient: Partial<Patient>) => { console.log('onPatientChange!!!!!!!!')
    setPatient(newPatient as Patient)
  }

  const data = (patient.closeAnamneses as CloseAnamnesis[])

  const onFieldChange = (name: string, value: string | boolean | CloseAnamnesis[]) => { console.log('onFieldChange!!!!!!!!')
    //if (onChange) {
      const newPatient = {
        ...patient,
        [name]: value,
      }
      onPatientChange(newPatient)
    //}
  }

  const onValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => { console.log('onValueChange!!!!!!!!')
    //if (onChange) {
      const newValue = event.currentTarget.value 
      const currentCloseAnamnesis = { ...data[index], name: newValue } //hay que usar el key del Objeto: e.g. name y no value
      console.log('currentClose: '+currentCloseAnamnesis.name +' -- '+currentCloseAnamnesis.description)
      const newCloseAnamneses = [...data]
      newCloseAnamneses.splice(index, 1, currentCloseAnamnesis)
      onFieldChange('closeAnamneses', newCloseAnamneses)
    //}
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
    //history.push(`/patients/${patient.id}/closeanamneses`)
    onCloseButtonClick()
  }

  /*const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setCloseAnamnesis((prevCloseAnamnesis) => ({ ...prevCloseAnamnesis, name }))
  }*/

  //in GI: onChange={(newPhoneNumbers) => onFieldChange('phoneNumbers', newPhoneNumbers)}
  //in ContactInfo:  
  /* 
  
  */

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
                //onChange={onNameChange}
                onChange={(event: any) => onValueChange(event, index)}
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
