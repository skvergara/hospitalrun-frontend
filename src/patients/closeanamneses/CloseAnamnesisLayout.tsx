import { Alert } from '@hospitalrun/components'
import React from 'react'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import CloseAnamnesis from '../../shared/model/CloseAnamnesis'
import { AddCloseAnamnesisError } from '../patient-slice'

interface Props {
  closeAnamnesis: Partial<CloseAnamnesis>
  closeAnamnesisError?: AddCloseAnamnesisError | undefined
  onChange?: (name: string, event: React.ChangeEvent<HTMLInputElement>) => void
  onDateChange?: (date: Date) => void
  isEditable?: boolean
  isRequired?: boolean
  index?: number
  forPanel?: boolean
}

const CloseAnamnesisLayout = (props: Props) => {
  const { closeAnamnesis, closeAnamnesisError, onChange, onDateChange, isEditable, isRequired, index, forPanel } = props
  const { t } = useTranslator()

  const onValueChange = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(name, event) 
    }
  }

  const body = <>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <TextInputWithLabelFormGroup
              name={`closeAnamnesisName${index}`}
              label={t('patient.closeAnamneses.closeAnamnesisName')}
              isEditable={isEditable}
              placeholder={t('patient.closeAnamneses.closeAnamnesisName')}
              value={closeAnamnesis.name}
              onChange={(event) => onValueChange('name', event)}
              isRequired={isRequired}
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
              name={`closeAnamnesisSize${index}`}
              label={t('patient.closeAnamneses.closeAnamnesisSize')}
              isEditable={isEditable}
              placeholder={t('patient.closeAnamneses.closeAnamnesisSize')}
              value={closeAnamnesis.size}
              onChange={(event) => onValueChange('size', event)}
              isRequired={isRequired}
              feedback={t(closeAnamnesisError?.size || '')}
              isInvalid={!!closeAnamnesisError?.size}
            />
          </div>
        </div>
      </div>
  </>

  if (forPanel) {
    return(
      <>
        <form>
          {body}
        </form>
      </>
    )
  }

  else {
    return(
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
                  name={`closeAnamnesisTitle${index}`}
                  label={t('patient.closeAnamneses.closeAnamnesisTitle')}
                  isEditable={isEditable}
                  placeholder={t('patient.closeAnamneses.closeAnamnesisTitle')}
                  value={closeAnamnesis.title}
                  onChange={(event) => onValueChange('title', event)}
                  isRequired={isRequired}
                  feedback={t(closeAnamnesisError?.title || '')} //mensaje de que campo es requerido
                  isInvalid={!!closeAnamnesisError?.title} //muestra el mensaje
                />
              </div>
            </div>
          </div>
          {body}
          <div className="row">
            <div className="col-md-12">
              <DatePickerWithLabelFormGroup
                name={`closeAnamnesisDate${index}`}
                label={t('patient.closeAnamneses.closeAnamnesisDate')}
                value={new Date(closeAnamnesis.closeAnamnesisDate || '')}
                isEditable={isEditable}
                onChange={onDateChange}
                isRequired={isRequired}
                feedback={t(closeAnamnesisError?.date || '')}
                isInvalid={!!closeAnamnesisError?.date}
              />
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default CloseAnamnesisLayout
