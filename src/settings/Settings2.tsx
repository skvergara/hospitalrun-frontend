import { Panel, TabsHeader, Tab } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    //useParams,
    useHistory,
    Route,
    useLocation,
    useRouteMatch,
} from 'react-router-dom'

import { useButtonToolbarSetter } from '../page-header/button-toolbar/ButtonBarProvider'
import useAddBreadcrumbs from '../page-header/breadcrumbs/useAddBreadcrumbs'
import LanguageSelector from '../shared/components/input/LanguageSelector'
import AppointmentTypes from './AppointmentTypes'
//import ViewPatients from '../patients/list/ViewPatients'
import useTitle from '../page-header/title/useTitle'
import useTranslator from '../shared/hooks/useTranslator'
//import { RootState } from '../shared/store'


const Settings2 = () => {
    const { t } = useTranslator()
    const history = useHistory()
    const dispatch = useDispatch()

    const location = useLocation()
    const { path } = useRouteMatch()

    useTitle(t('settings.label'))

    const setButtonToolBar = useButtonToolbarSetter()

    const breadcrumbs = [
        { i18nKey: 'settings.label', location: '/settings' }
    ]
    useAddBreadcrumbs(breadcrumbs, true)

    useEffect(() => {
        setButtonToolBar([])

        return () => {
            setButtonToolBar([])
        }
    }, [dispatch, setButtonToolBar, history, t])

    return (
        <div>
            <TabsHeader>
                <Tab
                    active={location.pathname === `/settings`}
                    label={t('patient.generalInformation')}
                    onClick={() => history.push(`/settings`)}
                />
                <Tab
                    active={location.pathname === `/settings/other`}
                    label={'Tipos de Citas'}
                    onClick={() => history.push(`/settings/other`)}
                />
            </TabsHeader>
            <Panel>
                <Route exact path={path}>
                    <LanguageSelector />
                </Route>
                <Route exact path={`${path}/other`}>
                    <AppointmentTypes />
                </Route>
            </Panel>
        </div>
    )
}

export default Settings2
