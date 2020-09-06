export default {
  patient: {
    code: 'Patient Code',
    firstName: 'First Name',
    lastName: 'Last Name',
    suffix: 'Suffix',
    prefix: 'Prefix',
    givenName: 'Given Name',
    familyName: 'Family Name',
    dateOfBirth: 'Date of Birth',
    approximateDateOfBirth: 'Approximate Date of Birth',
    age: 'Age',
    approximateAge: 'Approximate Age',
    placeOfBirth: 'Place of Birth',
    sex: 'Sex',
    bloodType: 'Blood Type',
    contactInfoType: {
      label: 'Type',
      options: {
        home: 'Home',
        mobile: 'Mobile',
        work: 'Work',
        temporary: 'Temporary',
        old: 'Old',
      },
    },
    phoneNumber: 'Phone Number',
    email: 'Email',
    address: 'Address',
    occupation: 'Occupation',
    type: 'Patient Type',
    preferredLanguage: 'Preferred Language',
    basicInformation: 'Basic Information',
    generalInformation: 'General Information',
    contactInformation: 'Contact Information',
    unknownDateOfBirth: 'Unknown',
    relatedPerson: 'Related Person',
    relatedPersons: {
      error: {
        unableToAddRelatedPerson: 'Unable to add new related person.',
        relatedPersonRequired: 'Related Person is required.',
        relationshipTypeRequired: 'Relationship Type is required.',
      },
      label: 'Related Persons',
      new: 'New Related Person',
      add: 'Add Related Person',
      relationshipType: 'Relationship Type',
      warning: {
        noRelatedPersons: 'No related persons',
      },
      addRelatedPersonAbove: 'Add a related person using the button above.',
    },
    appointments: {
      new: 'Add Appointment',
      warning: {
        noAppointments: 'No Appointments',
      },
      addAppointmentAbove: 'Add an appointment using the button above.',
    },
    allergies: {
      label: 'Allergies',
      allergyName: 'Allergy Name',
      new: 'Add Allergy',
      error: {
        nameRequired: 'Name is required.',
        unableToAdd: 'Unable to add allergy.',
      },
      warning: {
        noAllergies: 'No Allergies',
      },
      addAllergyAbove: 'Add an allergy using the button above.',
      successfullyAdded: 'Successfully added a new allergy!',
    },
    diagnoses: {
      label: 'Diagnoses',
      new: 'Add Diagnosis',
      diagnosisName: 'Diagnosis Name',
      diagnosisDate: 'Diagnosis Date',
      onsetDate: 'Onset Date',
      abatementDate: 'Abatement Date',
      visit: 'Visit',
      status: 'Status',
      active: 'Active',
      recurrence: 'Recurrence',
      relapse: 'Relapse',
      inactive: 'Inactive',
      remission: 'Remission',
      resolved: 'Resolved',
      note: 'Note',
      warning: {
        noDiagnoses: 'No Diagnoses',
      },
      error: {
        nameRequired: 'Diagnosis Name is required.',
        dateRequired: 'Diagnosis Date is required.',
        unableToAdd: 'Unable to add new diagnosis',
      },
      addDiagnosisAbove: 'Add a diagnosis using the button above.',
      successfullyAdded: 'Successfully added a new diagnosis!',
    },
    medicalrecords: {
      label: 'Medical Records',
      new: 'Add Medical Record',
      medicalRecordName: 'Medical Record Name',
      medicalRecordDate: 'Medical Record Date',
      medicalRecordAperture: 'Medical Record Aperture',
      warning: {
        noMedicalRecords: 'No Medical Records',
      },
      error: {
        nameRequired: 'Medical Record Name is required.',
        dateRequired: 'Medical Record Date is required.',
        unableToAdd: 'Unable to add new medical record',
      },
      addMedicalRecordAbove: 'Add a medical record using the button above.',
      successfullyAdded: 'Successfully added a new medical record!',
    },
    closeAnamneses: {
      label: 'Close Anamneses',
      new: 'Add Close Anamnesis',
      edit: 'Edit Close Anamnesis',
      closeAnamnesisTitle: 'Close Anamnesis Title',
      closeAnamnesisName: 'Close Anamnesis Name',
      closeAnamnesisSize: 'Close Anamnesis Size',
      closeAnamnesisDate: 'Close Anamnesis Date',
      warning: {
        noCloseAnamneses: 'No Close Anamneses',
      },
      error: {
        titleRequired: 'Close Anamnesis Title is required.',
        nameRequired: 'Close Anamnesis Name is required.',
        sizeRequired: 'Close Anamnesis Size is required.',
        dateRequired: 'Close Anamnesis Date is required.',
        unableToAdd: 'Unable to add new close anamnesis',
      },
      addCloseAnamnesisAbove: 'Add a close anamnesis using the button above.',
      successfullyAdded: 'Successfully added a new close anamnesis!',
      successfullyUpdated: 'Successfully updated the close anamnesis!',
      deleteConfirmationMessage: 'Are you sure you want to delete this close anamnesis?'
    },
    note: 'Note',
    notes: {
      label: 'Notes',
      new: 'Add New Note',
      warning: {
        noNotes: 'No Notes',
      },
      error: {
        noteRequired: 'Note is required.',
        unableToAdd: 'Unable to add new note.',
      },
      addNoteAbove: 'Add a note using the button above.',
    },
    labs: {
      label: 'Labs',
      new: 'Add New Lab',
      warning: {
        noLabs: 'No Labs',
      },
      noLabsMessage: 'No labs requests for this person.',
    },
    carePlan: {
      new: 'Add Care Plan',
      label: 'Care Plans',
      title: 'Title',
      description: 'Description',
      status: 'Status',
      condition: 'Condition',
      intent: 'Intent',
      startDate: 'Start Date',
      endDate: 'End Date',
      note: 'Note',
      error: {
        unableToAdd: 'Unable to add a new care plan.',
        titleRequired: 'Title is required.',
        descriptionRequired: 'Description is required.',
        conditionRequired: 'Condition is required.',
        statusRequired: 'Status is required.',
        intentRequired: 'Intent is required.',
        startDate: 'Start date is required.',
        endDate: 'End date is required',
      },
    },
    carePlans: {
      warning: {
        noCarePlans: 'No Care Plans',
        addCarePlanAbove: 'Add a care plan using the button above.',
      },
    },
    visit: 'Visit',
    visits: {
      new: 'Add Visit',
      label: 'Visits',
      startDateTime: 'Start Date',
      endDateTime: 'End Date',
      type: 'Type',
      status: 'Status',
      reason: 'Reason',
      location: 'Location',
      error: {
        unableToAdd: 'Unable to add a new visit.',
        startDateRequired: 'Start date is required.',
        endDateRequired: 'End date is required',
        endDateMustBeAfterStartDate: 'End date must be after start date',
        typeRequired: 'Type is required.',
        statusRequired: 'Status is required.',
        reasonRequired: 'Reason is required.',
        locationRequired: 'Location is required.',
      },
    },
    types: {
      charity: 'Charity',
      private: 'Private',
    },
    errors: {
      createPatientError: 'Could not create new patient.',
      updatePatientError: 'Could not update patient.',
      patientGivenNameFeedback: 'Given Name is required.',
      patientDateOfBirthFeedback: 'Date of Birth can not be greater than today',
      patientNumInSuffixFeedback: 'Cannot contain numbers.',
      patientNumInPrefixFeedback: 'Cannot contain numbers.',
      patientNumInFamilyNameFeedback: 'Cannot contain numbers.',
      patientNumInPreferredLanguageFeedback: 'Cannot contain numbers.',
      invalidEmail: 'Must be a valid email.',
      invalidPhoneNumber: 'Must be a valid phone number.',
    },
  },
}
