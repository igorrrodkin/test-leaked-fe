import React from 'react';

import SettingsUsers from '@/components/Settings/Users/SettingsUsers';

interface Props {
  organisationId: number
}

const OrganisationUsers: React.FC<Props> = ({ organisationId }) => <SettingsUsers organisationId={organisationId} />;

export default OrganisationUsers;
