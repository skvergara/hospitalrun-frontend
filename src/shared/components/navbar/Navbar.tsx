import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { logout } from '../../../user/user-slice'
import useTranslator from '../../hooks/useTranslator'
import { RootState } from '../../store'
import pageMap, { Page } from './pageMap'

import logo from '../../static/images/logo-inner.png'

const Navbar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslator()
  const { permissions, user } = useSelector((state: RootState) => state.user)

  // modify image size
  const parentNavbar = document.getElementById('responsive-navbar-nav')
  const image = parentNavbar?.getElementsByTagName('img')[0]

  if (image) {
    image.removeAttribute('width')
    image.height = 32
  }
  // end modify image size

  const navigateTo = (location: string) => {
    history.push(location)
  }

  const dividerAboveLabels = [
    'scheduling.appointments.new',
    /*'labs.requests.new',
    'medications.requests.new',
    'incidents.reports.new',
    'imagings.requests.new',*/
    'settings.label',
  ]

  function getDropdownListOfPages(pages: Page[]) {
    return pages
      .filter((page) => !page.permission || permissions.includes(page.permission))
      .map((page) => ({
        type: 'link',
        label: t(page.label),
        icon: `${page.icon}`,
        onClick: () => {
          navigateTo(page.path)
        },
        dividerAbove: dividerAboveLabels.includes(page.label),
      }))
  }

  // For Mobile, hamburger menu
  const hambergerPages = Object.keys(pageMap).map((key) => pageMap[key])

  // For Desktop, add shortcuts menu
  const addPages = [
    pageMap.newPatient,
    pageMap.newAppointment,
    /*pageMap.newLab,
    pageMap.newIncident,
    pageMap.newImaging,
    pageMap.newMedication,*/
  ]

  return (
    <HospitalRunNavbar
      bg="dark"
      variant="dark"
      navItems={[
        {
          name: 'menu',
          size: 'lg',
          type: 'link-list-icon',
          children: getDropdownListOfPages(hambergerPages),
          label: '',
          className: 'nav-hamberger pr-4 d-md-none',
        },
        {
          type: 'image',
          src: logo,
          onClick: () => {
            navigateTo('/')
          },
          className: 'nav-image',
        },
        {
          type: 'link-list-icon',
          alignRight: true,
          children: getDropdownListOfPages(addPages),
          className: 'ml-auto nav-add-new d-none d-md-block',
          iconClassName: 'align-bottom',
          label: 'Add',
          name: 'add',
          size: 'lg',
        },
        {
          type: 'link-list-icon',
          alignRight: true,
          children: [
            {
              type: 'link',
              label: `${t('user.login.currentlySignedInAs')} ${user?.givenName} ${
                user?.familyName
                }`,
              onClick: () => {
                navigateTo('/settings')
              },
            },
            {
              type: 'link',
              label: t('settings.label'),
              onClick: () => {
                navigateTo('/settings')
              },
            },
            {
              type: 'link',
              label: t('actions.logout'),
              onClick: () => {
                dispatch(logout())
                navigateTo('/login')
              },
            },
          ],
          className: 'pl-2 d-none d-md-block nav-account',
          iconClassName: 'align-bottom',
          label: 'Patient',
          name: 'patient',
          size: 'lg',
        },
      ]}
    />
  )
}
export default Navbar
